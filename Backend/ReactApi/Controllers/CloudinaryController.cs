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
            var uploadPreset = string.IsNullOrWhiteSpace(_config["Cloudinary:UploadPreset"])
    ? "smooothpixel_upload"
    : _config["Cloudinary:UploadPreset"];

            var configured =
                !string.IsNullOrEmpty(cloudName) &&
                !string.IsNullOrEmpty(apiKey) &&
                !string.IsNullOrEmpty(apiSecret);

            return Ok(new
            {
                configured,
                cloudName = cloudName ?? "",
                uploadPreset,
                hasApiKey = !string.IsNullOrEmpty(apiKey),
                hasApiSecret = !string.IsNullOrEmpty(apiSecret),
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
            var uploadPreset = string.IsNullOrWhiteSpace(_config["Cloudinary:UploadPreset"])
    ? "smooothpixel_upload"
    : _config["Cloudinary:UploadPreset"];
            var defaultFolder = _config["Cloudinary:Folder"] ?? "smooothpixel";

            if (string.IsNullOrEmpty(cloudName) ||
                string.IsNullOrEmpty(apiKey) ||
                string.IsNullOrEmpty(apiSecret))
            {
                return BadRequest(new
                {
                    error = "Cloudinary is not configured on the server."
                });
            }

            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var targetFolder = string.IsNullOrEmpty(folder)
                ? defaultFolder
                : folder;

            var sb = new StringBuilder();
            sb.Append($"folder={targetFolder}&timestamp={timestamp}&upload_preset={uploadPreset}");
            sb.Append(apiSecret);

            using var sha1 = SHA1.Create();

            var hashBytes = sha1.ComputeHash(
                Encoding.UTF8.GetBytes(sb.ToString()));

            var signature = BitConverter
                .ToString(hashBytes)
                .Replace("-", "")
                .ToLowerInvariant();

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
            var uploadPreset = string.IsNullOrWhiteSpace(_config["Cloudinary:UploadPreset"])
    ? "smooothpixel_upload"
    : _config["Cloudinary:UploadPreset"];
            var defaultFolder = _config["Cloudinary:Folder"] ?? "smooothpixel";

            if (string.IsNullOrEmpty(cloudName) ||
                string.IsNullOrEmpty(apiKey) ||
                string.IsNullOrEmpty(apiSecret))
            {
                return StatusCode(503, new
                {
                    error = "Cloudinary is not configured on the server."
                });
            }

            try
            {
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

                var targetFolder = string.IsNullOrEmpty(folder)
                    ? defaultFolder
                    : folder;

                var resourceType =
                    file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase)
                        ? "video"
                        : file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
                            ? "image"
                            : "auto";

                var sb = new StringBuilder();
                sb.Append($"folder={targetFolder}&timestamp={timestamp}&upload_preset={uploadPreset}");
                sb.Append(apiSecret);

                using var sha1 = SHA1.Create();

                var signature = BitConverter
                    .ToString(
                        sha1.ComputeHash(
                            Encoding.UTF8.GetBytes(sb.ToString())))
                    .Replace("-", "")
                    .ToLowerInvariant();

                using var form = new MultipartFormDataContent();

                var stream = file.OpenReadStream();

                var streamContent = new StreamContent(stream);

                streamContent.Headers.ContentType =
                    new System.Net.Http.Headers.MediaTypeHeaderValue(
                        file.ContentType);

                form.Add(streamContent, "file", file.FileName);

                form.Add(new StringContent(apiKey), "api_key");
                form.Add(new StringContent(timestamp.ToString()), "timestamp");
                form.Add(new StringContent(signature), "signature");
                form.Add(new StringContent(uploadPreset), "upload_preset");
                form.Add(new StringContent(targetFolder), "folder");

                var uploadUrl =
                    $"https://api.cloudinary.com/v1_1/{cloudName}/{resourceType}/upload";

                var http = _httpClientFactory.CreateClient();

                http.Timeout = TimeSpan.FromMinutes(5);

                var response = await http.PostAsync(uploadUrl, form);

                stream.Dispose();

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
        }
    }
}