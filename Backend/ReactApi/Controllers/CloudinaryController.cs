using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;

namespace ReactApi.Controllers
{
    /// <summary>
    /// Cloudinary integration endpoints. Status is anonymous (used by the admin UI
    /// to display "Cloudinary OK / not configured"). Signature and upload endpoints
    /// require admin authentication — only logged-in admins can push files.
    ///
    /// Credentials are read from configuration:
    ///   Cloudinary:CloudName, Cloudinary:ApiKey, Cloudinary:ApiSecret, Cloudinary:UploadPreset, Cloudinary:Folder
    /// </summary>
    [Route("api/cloudinary")]
    [ApiController]
    public class CloudinaryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<CloudinaryController> _logger;

        public CloudinaryController(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<CloudinaryController> logger)
        {
            _config = config;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        /// <summary>
        /// Returns whether the backend has Cloudinary configured and the configured
        /// cloud name / upload preset. The frontend uses this for diagnostics — if
        /// "configured" is false, uploads will fail and the admin UI should explain why.
        /// </summary>
        [HttpGet("status")]
        public IActionResult Status()
        {
            var cloudName = _config["Cloudinary:CloudName"];
            var apiKey = _config["Cloudinary:ApiKey"];
            var apiSecret = _config["Cloudinary:ApiSecret"];
            var uploadPreset = _config["Cloudinary:UploadPreset"] ?? "smooothpixel_upload";

            var configured = !string.IsNullOrEmpty(cloudName)
                          && !string.IsNullOrEmpty(apiKey)
                          && !string.IsNullOrEmpty(apiSecret);

            return Ok(new
            {
                configured,
                cloudName = cloudName ?? "",
                uploadPreset,
                // Don't echo back the secret or key — only that they're present
                hasApiKey = !string.IsNullOrEmpty(apiKey),
                hasApiSecret = !string.IsNullOrEmpty(apiSecret),
                message = configured
                    ? "Cloudinary is configured. Signed uploads and Media Library will work."
                    : "Cloudinary credentials are missing. Set Cloudinary__CloudName, Cloudinary__ApiKey, and Cloudinary__ApiSecret in appsettings or environment variables."
            });
        }

        /// <summary>
        /// Returns a SHA1 signature + timestamp for direct browser-to-Cloudinary uploads.
        /// The frontend uses this to do signed uploads without exposing the API secret.
        /// Signature is computed per Cloudinary docs:
        ///   signature = SHA1( sorted_params_as_query_string + api_secret )
        /// </summary>
        [HttpGet("signature")]
        [Authorize]
        public IActionResult Signature([FromQuery] string folder = "")
        {
            var cloudName = _config["Cloudinary:CloudName"];
            var apiKey = _config["Cloudinary:ApiKey"];
            var apiSecret = _config["Cloudinary:ApiSecret"];
            var uploadPreset = _config["Cloudinary:UploadPreset"] ?? "smooothpixel_upload";
            var defaultFolder = _config["Cloudinary:Folder"] ?? "smooothpixel";

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
                return BadRequest(new { error = "Cloudinary is not configured on the server." });

            var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
            var targetFolder = string.IsNullOrEmpty(folder) ? defaultFolder : folder;

            // Build the params to sign (must be sorted alphabetically by key)
            var sb = new StringBuilder();
            sb.Append($"folder={targetFolder}&timestamp={timestamp}&upload_preset={uploadPreset}");
            sb.Append(apiSecret);

            using var sha1 = SHA1.Create();
            var bytes = Encoding.UTF8.GetBytes(sb.ToString());
            var hashBytes = sha1.ComputeHash(bytes);
            var signature = BitConverter.ToString(hashBytes).Replace("-", "").ToLowerInvariant();

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

        /// <summary>
        /// Server-side upload proxy. The frontend POSTs the file to this endpoint and
        /// the backend streams it to Cloudinary. This avoids browser CORS issues and
        /// keeps the API secret on the server. Returns the Cloudinary response (with
        /// secure_url, public_id, etc.).
        /// </summary>
        [ApiExplorerSettings(IgnoreApi = true)] // Swashbuckle can't document IFormFile from [FromForm] — skip it
        [HttpPost("upload")]
        [Authorize]
        [RequestSizeLimit(200_000_000)] // 200 MB
        public async Task<IActionResult> Upload([FromForm] IFormFile file, [FromQuery] string folder = "")
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "No file provided." });

            var cloudName = _config["Cloudinary:CloudName"];
            var apiKey = _config["Cloudinary:ApiKey"];
            var apiSecret = _config["Cloudinary:ApiSecret"];
            var uploadPreset = _config["Cloudinary:UploadPreset"] ?? "smooothpixel_upload";
            var defaultFolder = _config["Cloudinary:Folder"] ?? "smooothpixel";

            if (string.IsNullOrEmpty(cloudName) || string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(apiSecret))
                return StatusCode(503, new { error = "Cloudinary is not configured on the server." });

            try
            {
                var timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                var targetFolder = string.IsNullOrEmpty(folder) ? defaultFolder : folder;

                // Determine resource type by content type
                var resourceType = file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase)
                    ? "video"
                    : file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
                        ? "image"
                        : "auto";

                // Build signature
                var sb = new StringBuilder();
                sb.Append($"folder={targetFolder}&timestamp={timestamp}&upload_preset={uploadPreset}");
                sb.Append(apiSecret);
                using var sha1 = SHA1.Create();
                var signature = BitConverter.ToString(sha1.ComputeHash(Encoding.UTF8.GetBytes(sb.ToString())))
                    .Replace("-", "").ToLowerInvariant();

                using var form = new MultipartFormDataContent();
                await using (var stream = file.OpenReadStream())
                {
                    var streamContent = new StreamContent(stream);
                    streamContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
                    form.Add(streamContent, "file", file.FileName);
                }
                form.Add(new StringContent(apiKey), "api_key");
                form.Add(new StringContent(timestamp.ToString()), "timestamp");
                form.Add(new StringContent(signature), "signature");
                form.Add(new StringContent(uploadPreset), "upload_preset");
                form.Add(new StringContent(targetFolder), "folder");

                var uploadUrl = $"https://api.cloudinary.com/v1_1/{cloudName}/{resourceType}/upload";
                var http = _httpClientFactory.CreateClient();
                http.Timeout = TimeSpan.FromMinutes(5);
                var response = await http.PostAsync(uploadUrl, form);

                var body = await response.Content.ReadAsStringAsync();
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("Cloudinary upload failed: {Status} {Body}", response.StatusCode, body);
                    return StatusCode((int)response.StatusCode, new
                    {
                        error = "Cloudinary rejected the upload.",
                        cloudinaryStatus = (int)response.StatusCode,
                        cloudinaryBody = body
                    });
                }

                // Pass through Cloudinary's JSON response
                return Content(body, "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cloudinary upload proxy failed");
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
