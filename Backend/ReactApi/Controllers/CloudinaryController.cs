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
            var cloudName = _config["Cloudinary:CloudName"];
            var apiKey = _config["Cloudinary:ApiKey"];
            var apiSecret = _config["Cloudinary:ApiSecret"];
            var uploadPreset = GetUploadPreset();

            var configured =
                !string.IsNullOrWhiteSpace(cloudName) &&
                !string.IsNullOrWhiteSpace(apiKey) &&
                !string.IsNullOrWhiteSpace(apiSecret);

            return Ok(new
            {
                configured,
                cloudName = cloudName ?? "",
                uploadPreset,
                hasApiKey = !string.IsNullOrWhiteSpace(apiKey),
                hasApiSecret = !string.IsNullOrWhiteSpace(apiSecret),
                message = configured
                    ? "Cloudinary is configured."
                    : "Cloudinary credentials are missing."
            });
        }

        [HttpGet("signature")]
        [Authorize]
        public IActionResult Signature([FromQuery] string folder = "")
        {
            var cloudName = _config["Cloudinary:CloudName"];
            var apiKey = _config["Cloudinary:ApiKey"];
            var apiSecret = _config["Cloudinary:ApiSecret"];
            var uploadPreset = GetUploadPreset();
            var defaultFolder = GetDefaultFolder();

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(apiKey) ||
                string.IsNullOrWhiteSpace(apiSecret))
            {
                return BadRequest(new
                {
                    error = "Cloudinary is not configured on the server."
                });
            }

            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var targetFolder = string.IsNullOrWhiteSpace(folder) ? defaultFolder : folder;

            var signaturePayload =
                $"folder={targetFolder}&timestamp={timestamp}&upload_preset={uploadPreset}{apiSecret}";

            var signature = GenerateSha1(signaturePayload);

            return Ok(new
            {
                cloudName,
                apiKey,
                uploadPreset,
                timestamp,
                folder = targetFolder,
                signature
            });
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
                return BadRequest(new
                {
                    error = "No file provided."
                });
            }

            var cloudName = _config["Cloudinary:CloudName"];
            var apiKey = _config["Cloudinary:ApiKey"];
            var apiSecret = _config["Cloudinary:ApiSecret"];
            var defaultFolder = GetDefaultFolder();

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(apiKey) ||
                string.IsNullOrWhiteSpace(apiSecret))
            {
                return StatusCode(503, new
                {
                    error = "Cloudinary is not configured on the server."
                });
            }

            Stream? stream = null;

            try
            {
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                var targetFolder = string.IsNullOrWhiteSpace(folder) ? defaultFolder : folder;

                var resourceType =
                    file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase)
                        ? "video"
                        : file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
                            ? "image"
                            : "auto";

                // IMPORTANT:
                // For server-side signed upload, upload_preset is not required.
                // This avoids Cloudinary "Upload preset must be specified when using unsigned upload" errors.
                var signaturePayload =
                    $"folder={targetFolder}&timestamp={timestamp}{apiSecret}";

                var signature = GenerateSha1(signaturePayload);

                using var form = new MultipartFormDataContent();

                stream = file.OpenReadStream();

                var streamContent = new StreamContent(stream);
                streamContent.Headers.ContentType =
                    new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);

                form.Add(streamContent, "file", file.FileName);
                form.Add(new StringContent(apiKey), "api_key");
                form.Add(new StringContent(timestamp.ToString()), "timestamp");
                form.Add(new StringContent(signature), "signature");
                form.Add(new StringContent(targetFolder), "folder");

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
                        body);

                    return StatusCode((int)response.StatusCode, new
                    {
                        error = "Cloudinary rejected the upload.",
                        cloudinaryStatus = (int)response.StatusCode,
                        cloudinaryBody = body
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

        private string GetUploadPreset()
        {
            var preset = _config["Cloudinary:UploadPreset"];
            return string.IsNullOrWhiteSpace(preset)
                ? "smooothpixel_upload"
                : preset;
        }

        private string GetDefaultFolder()
        {
            var folder = _config["Cloudinary:Folder"];
            return string.IsNullOrWhiteSpace(folder)
                ? "smooothpixel"
                : folder;
        }

        private static string GenerateSha1(string input)
        {
            using var sha1 = SHA1.Create();
            var bytes = Encoding.UTF8.GetBytes(input);
            var hashBytes = sha1.ComputeHash(bytes);

            return BitConverter
                .ToString(hashBytes)
                .Replace("-", "")
                .ToLowerInvariant();
        }
    }
}