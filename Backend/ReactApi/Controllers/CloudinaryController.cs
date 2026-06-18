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

            return Ok(new
            {
                configured = !string.IsNullOrWhiteSpace(cloudName) &&
                             !string.IsNullOrWhiteSpace(uploadPreset),
                cloudName = cloudName ?? "",
                uploadPreset,
                hasCloudName = !string.IsNullOrWhiteSpace(cloudName),
                hasUploadPreset = !string.IsNullOrWhiteSpace(uploadPreset),
                message = "Cloudinary unsigned upload is configured."
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
                return BadRequest(new { error = "No file provided." });
            }

            var cloudName = _config["Cloudinary:CloudName"];
            var uploadPreset = GetUploadPreset();
            var targetFolder = string.IsNullOrWhiteSpace(folder)
                ? GetDefaultFolder()
                : folder;

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(uploadPreset))
            {
                return StatusCode(503, new
                {
                    error = "Cloudinary is not configured. Missing Cloudinary__CloudName or Cloudinary__UploadPreset."
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

                _logger.LogWarning(
                    "UPLOAD DEBUG => CloudName={CloudName}, ResourceType={ResourceType}, Preset={Preset}, Folder={Folder}, FileName={FileName}, ContentType={ContentType}, Size={Size}",
                    cloudName,
                    resourceType,
                    uploadPreset,
                    targetFolder,
                    file.FileName,
                    file.ContentType,
                    file.Length
                );

                foreach (var item in form)
                {
                    _logger.LogWarning(
                        "UPLOAD FORM FIELD => {FieldName}",
                        item.Headers.ContentDisposition?.Name
                    );
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