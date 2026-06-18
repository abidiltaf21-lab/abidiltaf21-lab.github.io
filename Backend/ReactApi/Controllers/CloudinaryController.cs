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
            var uploadPreset = GetUploadPreset();

            var configured =
                !string.IsNullOrWhiteSpace(cloudName) &&
                !string.IsNullOrWhiteSpace(uploadPreset);

            return Ok(new
            {
                configured,
                cloudName = cloudName ?? "",
                uploadPreset,
                hasCloudName = !string.IsNullOrWhiteSpace(cloudName),
                hasUploadPreset = !string.IsNullOrWhiteSpace(uploadPreset),
                message = configured
                    ? "Cloudinary unsigned upload is configured."
                    : "Cloudinary CloudName or UploadPreset is missing."
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
            var uploadPreset = GetUploadPreset();
            var defaultFolder = GetDefaultFolder();

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(uploadPreset))
            {
                return StatusCode(503, new
                {
                    error = "Cloudinary is not configured on the server. Set Cloudinary__CloudName and Cloudinary__UploadPreset."
                });
            }

            Stream? stream = null;

            try
            {
                var targetFolder = string.IsNullOrWhiteSpace(folder)
                    ? defaultFolder
                    : folder;

                var resourceType =
                    file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase)
                        ? "video"
                        : file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase)
                            ? "image"
                            : "auto";

                using var form = new MultipartFormDataContent();

                stream = file.OpenReadStream();

                var streamContent = new StreamContent(stream);

                if (!string.IsNullOrWhiteSpace(file.ContentType))
                {
                    streamContent.Headers.ContentType =
                        new System.Net.Http.Headers.MediaTypeHeaderValue(file.ContentType);
                }

                form.Add(streamContent, "file", file.FileName);
                form.Add(new StringContent(uploadPreset), "upload_preset");

                if (!string.IsNullOrWhiteSpace(targetFolder))
                {
                    form.Add(new StringContent(targetFolder), "folder");
                }

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
    }
}