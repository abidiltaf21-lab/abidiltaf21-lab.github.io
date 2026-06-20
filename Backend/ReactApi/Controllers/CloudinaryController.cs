using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace ReactApi.Controllers
{
    [Route("api/cloudinary")]
    [ApiController]
    public class CloudinaryController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<CloudinaryController> _logger;

        public CloudinaryController(
            IConfiguration config,
            ILogger<CloudinaryController> logger)
        {
            _config = config;
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
                message = "Cloudinary SDK signed upload is configured."
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
                string.IsNullOrWhiteSpace(apiSecret))
            {
                return Ok(new { error = "Config missing" });
            }

            try
            {
                var account = new Account(cloudName, apiKey, apiSecret);
                var cloudinary = new Cloudinary(account);

                var dummyBytes = System.Text.Encoding.UTF8.GetBytes("diagnostics SDK test file content");
                using var stream = new MemoryStream(dummyBytes);

                var uploadParams = new RawUploadParams
                {
                    File = new FileDescription("diagnostic_test_sdk.txt", stream),
                    Folder = targetFolder
                };

                var uploadResult = await cloudinary.UploadAsync(uploadParams);

                return Ok(new
                {
                    status = (int)uploadResult.StatusCode,
                    body = uploadResult.JsonObj?.ToString() ?? uploadResult.Error?.Message ?? "No body",
                    success = uploadResult.Error == null,
                    error = uploadResult.Error?.Message,
                    debug = new {
                        cloudName,
                        apiKey = apiKey.Substring(0, 4) + "... (len: " + apiKey.Length + ")",
                        apiSecret = apiSecret.Substring(0, 4) + "... (len: " + apiSecret.Length + ")",
                        targetFolder
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

            return await PerformUploadInternal(file, folder);
        }

        [HttpPost("upload-public")]
        [RequestSizeLimit(10_000_000)] // Limit to 10MB for public uploads
        public async Task<IActionResult> UploadPublic(
            [FromForm] IFormFile file,
            [FromQuery] string folder = "")
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new { error = "No file provided." });
            }

            // Public uploads are restricted to images only
            if (string.IsNullOrWhiteSpace(file.ContentType) || !file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new { error = "Only image uploads are allowed for reviews." });
            }

            if (file.Length > 10 * 1024 * 1024)
            {
                return BadRequest(new { error = "Image size cannot exceed 10MB." });
            }

            return await PerformUploadInternal(file, folder);
        }

        private async Task<IActionResult> PerformUploadInternal(IFormFile file, string folder)
        {
            var cloudName = _config["Cloudinary:CloudName"]?.Trim().Trim('"');
            var apiKey = _config["Cloudinary:ApiKey"]?.Trim().Trim('"');
            var apiSecret = _config["Cloudinary:ApiSecret"]?.Trim().Trim('"');
            var uploadPreset = GetUploadPreset();
            var targetFolder = string.IsNullOrWhiteSpace(folder)
                ? GetDefaultFolder()
                : folder;

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(apiKey) ||
                string.IsNullOrWhiteSpace(apiSecret))
            {
                return StatusCode(503, new
                {
                    error = "Cloudinary is not configured. Missing Cloudinary__CloudName, Cloudinary__ApiKey, or Cloudinary__ApiSecret."
                });
            }

            Stream? stream = null;

            try
            {
                var account = new Account(cloudName, apiKey, apiSecret);
                var cloudinary = new Cloudinary(account);

                var resourceType = "auto";
                if (!string.IsNullOrWhiteSpace(file.ContentType))
                {
                    if (file.ContentType.StartsWith("video/", StringComparison.OrdinalIgnoreCase))
                        resourceType = "video";
                    else if (file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                        resourceType = "image";
                }

                stream = file.OpenReadStream();
                var fileDesc = new FileDescription(file.FileName, stream);

                UploadResult uploadResult;

                if (resourceType == "video")
                {
                    var uploadParams = new VideoUploadParams
                    {
                        File = fileDesc,
                        Folder = targetFolder
                    };
                    uploadResult = await cloudinary.UploadAsync(uploadParams);
                }
                else if (resourceType == "image")
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = fileDesc,
                        Folder = targetFolder
                    };
                    uploadResult = await cloudinary.UploadAsync(uploadParams);
                }
                else
                {
                    var uploadParams = new RawUploadParams
                    {
                        File = fileDesc,
                        Folder = targetFolder
                    };
                    uploadResult = await cloudinary.UploadAsync(uploadParams);
                }

                if (uploadResult.Error != null)
                {
                    _logger.LogError("Cloudinary upload failed: {Message} (Status: {Status})", 
                        uploadResult.Error.Message, uploadResult.StatusCode);

                    return StatusCode((int)uploadResult.StatusCode, new
                    {
                        error = "Cloudinary rejected the upload.",
                        cloudinaryStatus = (int)uploadResult.StatusCode,
                        cloudinaryBody = uploadResult.JsonObj?.ToString() ?? uploadResult.Error.Message
                    });
                }

                var rawJson = uploadResult.JsonObj?.ToString() ?? "{}";
                return Content(rawJson, "application/json");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Cloudinary SDK upload failed");

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
