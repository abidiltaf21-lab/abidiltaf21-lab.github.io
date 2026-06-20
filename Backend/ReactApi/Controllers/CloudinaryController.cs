using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace ReactApi.Controllers
{
    [Route("api/cloudinary")]
    [ApiController]
    public class CloudinaryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<CloudinaryController> _logger;

        public CloudinaryController(
            IConfiguration config,
            IHttpClientFactory httpClientFactory,
            ILogger<CloudinaryController> logger)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        [HttpGet("status")]
        public IActionResult Status()
        {
            var cloudName = _config["Cloudinary:CloudName"]?.Trim().Trim('"');
            var apiKey = _config["Cloudinary:ApiKey"]?.Trim().Trim('"');
            var apiSecret = _config["Cloudinary:ApiSecret"]?.Trim().Trim('"');
            var uploadPreset = GetUploadPreset();

            return Ok(new
            {
                configured = !string.IsNullOrWhiteSpace(cloudName) &&
                             !string.IsNullOrWhiteSpace(uploadPreset) &&
                             !string.IsNullOrWhiteSpace(apiKey) &&
                             !string.IsNullOrWhiteSpace(apiSecret),
                cloudName = cloudName ?? "",
                hasCloudName = !string.IsNullOrWhiteSpace(cloudName),
                hasApiKey = !string.IsNullOrWhiteSpace(apiKey),
                hasApiSecret = !string.IsNullOrWhiteSpace(apiSecret),
                hasUploadPreset = !string.IsNullOrWhiteSpace(uploadPreset),
                uploadPreset,
                message = "Cloudinary signed upload is configured."
            });
        }

        [HttpGet("test-upload")]
        public async Task<IActionResult> TestUpload()
        {
            var cloudName = _config["Cloudinary:CloudName"]?.Trim().Trim('"');
            var apiKey = _config["Cloudinary:ApiKey"]?.Trim().Trim('"');
            var apiSecret = _config["Cloudinary:ApiSecret"]?.Trim().Trim('"');
            var uploadPreset = GetUploadPreset();
            var targetFolder = GetDefaultFolder();

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(apiKey) ||
                string.IsNullOrWhiteSpace(apiSecret) ||
                string.IsNullOrWhiteSpace(uploadPreset))
            {
                return Ok(new { error = "Config missing" });
            }

            try
            {
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                var signatureParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
                {
                    { "folder", targetFolder },
                    { "timestamp", timestamp.ToString(CultureInfo.InvariantCulture) },
                    { "upload_preset", uploadPreset }
                };
                var signature = ComputeCloudinarySignature(signatureParams, apiSecret);

                using var form = new MultipartFormDataContent();
                var dummyBytes = Encoding.UTF8.GetBytes("diagnostics test file content");
                var streamContent = new ByteArrayContent(dummyBytes);
                streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("text/plain");

                form.Add(streamContent, "file", "diagnostic_test.txt");
                var apiKeyContent = new StringContent(apiKey);
                apiKeyContent.Headers.Remove("Content-Type");
                form.Add(apiKeyContent, "api_key");

                var timestampContent = new StringContent(timestamp.ToString(CultureInfo.InvariantCulture));
                timestampContent.Headers.Remove("Content-Type");
                form.Add(timestampContent, "timestamp");

                var signatureContent = new StringContent(signature);
                signatureContent.Headers.Remove("Content-Type");
                form.Add(signatureContent, "signature");

                var uploadPresetContent = new StringContent(uploadPreset);
                uploadPresetContent.Headers.Remove("Content-Type");
                form.Add(uploadPresetContent, "upload_preset");

                var folderContent = new StringContent(targetFolder);
                folderContent.Headers.Remove("Content-Type");
                form.Add(folderContent, "folder");

                var uploadUrl = $"https://api.cloudinary.com/v1_1/{cloudName}/raw/upload";
                var http = _httpClientFactory.CreateClient();
                var response = await http.PostAsync(uploadUrl, form);
                var body = await response.Content.ReadAsStringAsync();

                var headers = new Dictionary<string, string>();
                foreach (var h in response.Headers)
                {
                    headers[h.Key] = string.Join(", ", h.Value);
                }
                foreach (var h in response.Content.Headers)
                {
                    headers[h.Key] = string.Join(", ", h.Value);
                }

                return Ok(new
                {
                    status = (int)response.StatusCode,
                    body = body,
                    headers = headers,
                    debug = new {
                        cloudName,
                        apiKey = apiKey.Substring(0, 4) + "...",
                        apiSecret = apiSecret.Substring(0, 4) + "...",
                        uploadPreset,
                        targetFolder,
                        timestamp,
                        signature
                    }
                });
            }
            catch (Exception ex)
            {
                return Ok(new { error = ex.ToString() });
            }
        }

        [ApiExplorerSettings(IgnoreApi = true)]
        [HttpPost("upload")]
        [Authorize]
        [RequestSizeLimit(200_000_000)]
        public async Task<IActionResult> Upload(
            [FromForm] IFormFile file,
            [FromQuery] string folder = "")
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file provided." });
            }

            var cloudName = _config["Cloudinary:CloudName"]?.Trim().Trim('"');
            var apiKey = _config["Cloudinary:ApiKey"]?.Trim().Trim('"');
            var apiSecret = _config["Cloudinary:ApiSecret"]?.Trim().Trim('"');
            var uploadPreset = GetUploadPreset();
            var targetFolder = string.IsNullOrWhiteSpace(folder)
                ? GetDefaultFolder()
                : folder;

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(apiKey) ||
                string.IsNullOrWhiteSpace(apiSecret) ||
                string.IsNullOrWhiteSpace(uploadPreset))
            {
                return StatusCode(503, new
                {
                    error = "Cloudinary is not configured. Missing one of: Cloudinary__CloudName, Cloudinary__ApiKey, Cloudinary__ApiSecret, Cloudinary__UploadPreset."
                });
            }

            Stream? stream = null;

            try
            {
                var resourceType = "auto";

                if (!string.IsNullOrWhiteSpace(file.ContentType))
                {
                    if (file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
                        resourceType = "video";
                    else if (file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                        resourceType = "image";
                }

                // Compute signed-upload timestamp + signature.
                // Cloudinary signature = SHA1("folder=...&timestamp=...&upload_preset=...&<api_secret>")
                // Params are sorted alphabetically by key.
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                var signatureParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
                {
                    { "folder", targetFolder },
                    { "timestamp", timestamp.ToString(CultureInfo.InvariantCulture) },
                    { "upload_preset", uploadPreset }
                };

                var signature = ComputeCloudinarySignature(signatureParams, apiSecret!);

                using var form = new MultipartFormDataContent();

                stream = file.OpenReadStream();

                var streamContent = new StreamContent(stream);

                if (!string.IsNullOrWhiteSpace(file.ContentType))
                {
                    streamContent.Headers.ContentType =
                        new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
                }

                form.Add(streamContent, "file", file.FileName);
                var apiKeyContent = new StringContent(apiKey!);
                apiKeyContent.Headers.Remove("Content-Type");
                form.Add(apiKeyContent, "api_key");

                var timestampContent = new StringContent(timestamp.ToString(CultureInfo.InvariantCulture));
                timestampContent.Headers.Remove("Content-Type");
                form.Add(timestampContent, "timestamp");

                var signatureContent = new StringContent(signature);
                signatureContent.Headers.Remove("Content-Type");
                form.Add(signatureContent, "signature");

                var uploadPresetContent = new StringContent(uploadPreset);
                uploadPresetContent.Headers.Remove("Content-Type");
                form.Add(uploadPresetContent, "upload_preset");

                var folderContent = new StringContent(targetFolder);
                folderContent.Headers.Remove("Content-Type");
                form.Add(folderContent, "folder");

                _logger.LogWarning(
                    "UPLOAD DEBUG (signed) => CloudName={CloudName}, ResourceType={ResourceType}, Preset={Preset}, Folder={Folder}, FileName={FileName}, ContentType={ContentType}, Size={Size}",
                    cloudName,
                    resourceType,
                    uploadPreset,
                    targetFolder,
                    file.FileName,
                    file.ContentType,
                    file.Length
                );

                var uploadUrl =
                    $"https://api.cloudinary.com/v1_1/{cloudName}/{resourceType}/upload";

                var http = _httpClientFactory.CreateClient();
                http.Timeout = TimeSpan.FromMinutes(5);

                var response = await http.PostAsync(uploadUrl, form);
                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError(
                        "Cloudinary upload failed: {Status} {Body}",
                        response.StatusCode,
                        body
                    );

                    return StatusCode((int)response.StatusCode, new
                    {
                        error = "Cloudinary rejected the upload.",
                        cloudinaryStatus = (int)response.StatusCode,
                        cloudinaryBody = body,
                        debug = new
                        {
                            cloudName,
                            resourceType,
                            uploadPreset,
                            targetFolder,
                            fileName = file.FileName,
                            file.ContentType,
                            file.Length
                        }
                    });
                }

                return Content(body, "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cloudinary upload proxy failed");

                return StatusCode(500, new
                {
                    error = ex.ToString()
                });
            }
            finally
            {
                stream?.Dispose();
            }
        }

        private static string ComputeCloudinarySignature(
            SortedDictionary<string, string> parameters,
            string apiSecret)
        {
            // Build "key1=value1&key2=value2&..." (already sorted by SortedDictionary).
            var sb = new StringBuilder();
            var first = true;
            foreach (var kv in parameters)
            {
                if (!first) sb.Append('&');
                sb.Append(kv.Key);
                sb.Append('=');
                sb.Append(kv.Value);
                first = false;
            }
            sb.Append(apiSecret);

            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var hash = SHA1.HashData(bytes);
            var hex = new StringBuilder(hash.Length * 2);
            foreach (var b in hash)
            {
                hex.Append(b.ToString("x2", CultureInfo.InvariantCulture));
            }
            return hex.ToString();
        }

        private string GetUploadPreset()
        {
            var preset = _config["Cloudinary:UploadPreset"];

            return string.IsNullOrWhiteSpace(preset)
                ? "smooothpixel_upload"
                : preset.Trim();
        }

        private string GetDefaultFolder()
        {
            var folder = _config["Cloudinary:Folder"];

            return string.IsNullOrWhiteSpace(folder)
                ? "smooothpixel"
                : folder.Trim();
        }
    }
}
