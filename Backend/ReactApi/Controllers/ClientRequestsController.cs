using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ReactApi.Controllers
{
    [Route("api/inbox")]
    [ApiController]
    public class ClientRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public ClientRequestsController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var all = await _context.ClientRequests.AsNoTracking().ToListAsync();
            return Ok(BuildStats(all));
        }

        [HttpGet]
        public async Task<IActionResult> GetRequests(
            [FromQuery] string? status,
            [FromQuery] string? search,
            [FromQuery] string? sort = "newest",
            [FromQuery] bool? unreadOnly = null,
            [FromQuery] bool includeStats = false)
        {
            try
            {
                return await GetRequestsCore(status, search, sort, unreadOnly, includeStats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Inbox could not be loaded. Restart ReactApi after updating the database.",
                    detail = ex.InnerException?.Message ?? ex.Message
                });
            }
        }

        private async Task<IActionResult> GetRequestsCore(
            string? status,
            string? search,
            string? sort,
            bool? unreadOnly,
            bool includeStats)
        {
            var query = _context.ClientRequests.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(status) && !string.Equals(status, "all", StringComparison.OrdinalIgnoreCase))
            {
                var statusNorm = status.Trim().ToLower();
                query = query.Where(r => r.Status != null && r.Status.Trim().ToLower() == statusNorm);
            }

            if (unreadOnly == true)
            {
                query = query.Where(r => !r.IsRead);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(r =>
                    r.Name.ToLower().Contains(term) ||
                    r.Email.ToLower().Contains(term) ||
                    (r.Phone != null && r.Phone.ToLower().Contains(term)) ||
                    (r.Telegram != null && r.Telegram.ToLower().Contains(term)) ||
                    r.Message.ToLower().Contains(term) ||
                    (r.ProjectType != null && r.ProjectType.ToLower().Contains(term)) ||
                    (r.BudgetRange != null && r.BudgetRange.ToLower().Contains(term)));
            }

            query = string.Equals(sort, "oldest", StringComparison.OrdinalIgnoreCase)
                ? query.OrderBy(r => r.CreatedAt)
                : query.OrderByDescending(r => r.CreatedAt);

            var list = await query.ToListAsync();

            if (!includeStats)
                return Ok(list);

            var all = await _context.ClientRequests.AsNoTracking().ToListAsync();
            return Ok(new
            {
                items = list,
                stats = BuildStats(all),
            });
        }

        private static object BuildStats(IReadOnlyList<ClientRequest> all) => new
        {
            total = all.Count,
            @new = all.Count(r => string.Equals(r.Status, "New", StringComparison.OrdinalIgnoreCase)),
            inProgress = all.Count(r => string.Equals(r.Status, "In Progress", StringComparison.OrdinalIgnoreCase)),
            closed = all.Count(r => string.Equals(r.Status, "Closed", StringComparison.OrdinalIgnoreCase)),
            unread = all.Count(r => !r.IsRead),
        };

        [HttpPost]
        [EnableRateLimiting("contact")]
        public async Task<ActionResult<ClientRequest>> PostRequest([FromBody] CreateInboxMessageDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Request body is required." });

            // ── Honeypot: if filled by a bot, silently reject ─────────────────────────
            if (!string.IsNullOrEmpty(dto.HoneypotField))
            {
                // Return 200 to fool bots — they'll think submission succeeded
                return Ok(new { message = "Message received." });
            }

            // ── Input Sanitization ────────────────────────────────────────────────────
            var name    = SanitizeInput(dto.Name,    maxLength: 100);
            var email   = SanitizeInput(dto.Email,   maxLength: 254);
            var message = SanitizeInput(dto.Message, maxLength: 2000);

            if (string.IsNullOrEmpty(name))
                return BadRequest(new { message = "Name is required." });

            if (string.IsNullOrEmpty(email))
                return BadRequest(new { message = "Email is required." });

            // ── Email format validation ────────────────────────────────────────────────
            if (!IsValidEmail(email))
                return BadRequest(new { message = "Please provide a valid email address." });

            if (string.IsNullOrEmpty(message))
                return BadRequest(new { message = "Message is required." });

            if (message.Length < 10)
                return BadRequest(new { message = "Message must be at least 10 characters." });

            var clientRequest = new ClientRequest
            {
                Name        = name,
                Email       = email,
                Phone       = string.IsNullOrWhiteSpace(dto.Phone)       ? null : SanitizeInput(dto.Phone, 30),
                Telegram    = NormalizeTelegram(dto.Telegram),
                Message     = message,
                ProjectType = string.IsNullOrWhiteSpace(dto.ProjectType) ? "Inquiry from Website" : SanitizeInput(dto.ProjectType, 100),
                BudgetRange = string.IsNullOrWhiteSpace(dto.BudgetRange) ? null : SanitizeInput(dto.BudgetRange, 50),
                Status      = "New",
                IsRead      = false,
                CreatedAt   = DateTime.UtcNow,
            };

            try
            {
                _context.ClientRequests.Add(clientRequest);
                await _context.SaveChangesAsync();

                // Trigger notifications in background (non-blocking)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var settings = await _context.SiteSettings.AsNoTracking().FirstOrDefaultAsync();
                        if (settings != null)
                        {
                            if (settings.NotifyTelegramEnabled)
                                await SendTelegramNotificationAsync(settings, clientRequest);

                            if (settings.NotifyEmailEnabled)
                                await SendEmailNotificationAsync(settings, clientRequest);
                        }
                    }
                    catch (Exception notifEx)
                    {
                        Console.WriteLine($"[NOTIFICATION ERROR] {notifEx.Message}");
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Could not save your message.",
                    detail  = ex.InnerException?.Message ?? ex.Message
                });
            }

            return CreatedAtAction(nameof(GetRequests), new { id = clientRequest.Id }, clientRequest);
        }

        // ── Input Sanitization Helpers ─────────────────────────────────────────────────

        /// <summary>Trims, limits length, and strips potentially dangerous HTML/script tags.</summary>
        private static string SanitizeInput(string? input, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(input)) return string.Empty;

            var trimmed = input.Trim();

            // Remove HTML/script tags
            var noHtml = Regex.Replace(trimmed, @"<[^>]+>", string.Empty, RegexOptions.IgnoreCase);

            // Remove common XSS vectors
            var noScript = Regex.Replace(noHtml,
                @"(javascript:|data:|vbscript:|on\w+\s*=)",
                string.Empty, RegexOptions.IgnoreCase);

            // Truncate to maxLength
            return noScript.Length > maxLength ? noScript[..maxLength] : noScript;
        }

        /// <summary>Validates email format with a permissive but safe RFC-5322 subset regex.</summary>
        private static bool IsValidEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || email.Length > 254) return false;
            return Regex.IsMatch(email,
                @"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$",
                RegexOptions.IgnoreCase);
        }

        private async Task SendTelegramNotificationAsync(SiteSetting settings, ClientRequest request)
        {
            var botToken = settings.NotifyTelegramBotToken;
            if (string.IsNullOrEmpty(botToken))
            {
                botToken = _configuration["Telegram:BotToken"];
            }

            var chatId = settings.NotifyTelegramChatId;
            if (string.IsNullOrEmpty(chatId))
            {
                chatId = _configuration["Telegram:ChatId"];
            }

            if (string.IsNullOrEmpty(botToken) || string.IsNullOrEmpty(chatId))
            {
                return;
            }

            var text = $"🔔 *New Client Request Received!*\n\n" +
                       $"👤 *Name:* {request.Name}\n" +
                       $"📧 *Email:* {request.Email}\n" +
                       $"📞 *Phone:* {request.Phone ?? "N/A"}\n" +
                       $"✈️ *Telegram:* {request.Telegram ?? "N/A"}\n" +
                       $"💼 *Project Type:* {request.ProjectType ?? "N/A"}\n" +
                       $"💰 *Budget:* {request.BudgetRange ?? "N/A"}\n\n" +
                       $"💬 *Message:*\n{request.Message}";

            var urlEncodedText = Uri.EscapeDataString(text);
            var url = $"https://api.telegram.org/bot{botToken}/sendMessage?chat_id={chatId}&text={urlEncodedText}&parse_mode=Markdown";

            using (var client = new HttpClient())
            {
                await client.GetAsync(url);
            }
        }

        private async Task SendEmailNotificationAsync(SiteSetting settings, ClientRequest request)
        {
            var toEmail = settings.NotifyEmailAddress;
            if (string.IsNullOrEmpty(toEmail))
            {
                return;
            }

            var smtpHost = _configuration["Smtp:Host"];
            var smtpPortStr = _configuration["Smtp:Port"];
            var smtpUser = _configuration["Smtp:Username"];
            var smtpPass = _configuration["Smtp:Password"];
            var fromEmail = _configuration["Smtp:FromEmail"] ?? "no-reply@smooothpixel.com";

            if (string.IsNullOrEmpty(smtpHost) || !int.TryParse(smtpPortStr, out int smtpPort))
            {
                return;
            }

            using (var mail = new System.Net.Mail.MailMessage())
            {
                mail.From = new System.Net.Mail.MailAddress(fromEmail, "Smooothpixel Studio Notifications");
                mail.To.Add(toEmail);
                mail.Subject = $"New Website Inquiry from {request.Name}";
                mail.Body = $"You have received a new message from the website contact form:\n\n" +
                            $"Name: {request.Name}\n" +
                            $"Email: {request.Email}\n" +
                            $"Phone: {request.Phone ?? "N/A"}\n" +
                            $"Telegram: {request.Telegram ?? "N/A"}\n" +
                            $"Project Type: {request.ProjectType ?? "N/A"}\n" +
                            $"Budget: {request.BudgetRange ?? "N/A"}\n\n" +
                            $"Message:\n{request.Message}";
                mail.IsBodyHtml = false;

                using (var smtp = new System.Net.Mail.SmtpClient(smtpHost, smtpPort))
                {
                    if (!string.IsNullOrEmpty(smtpUser))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPass);
                    }
                    smtp.EnableSsl = _configuration.GetValue<bool>("Smtp:EnableSsl", true);
                    await smtp.SendMailAsync(mail);
                }
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRequest(int id, [FromBody] UpdateClientRequestDto dto)
        {
            if (dto == null) return BadRequest(new { message = "Request body is required." });

            var existing = await _context.ClientRequests.FindAsync(id);
            if (existing == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.Status))
                existing.Status = dto.Status.Trim();
            if (dto.InternalNotes != null)
                existing.InternalNotes = dto.InternalNotes;
            if (dto.IsRead.HasValue)
                existing.IsRead = dto.IsRead.Value;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPatch("{id}/read")]
        public async Task<IActionResult> MarkRead(int id, [FromQuery] bool read = true)
        {
            var existing = await _context.ClientRequests.FindAsync(id);
            if (existing == null) return NotFound();

            existing.IsRead = read;
            await _context.SaveChangesAsync();
            return Ok(new { success = true, isRead = read });
        }

        [HttpPost("mark-all-read")]
        public async Task<IActionResult> MarkAllRead()
        {
            var unread = await _context.ClientRequests.Where(r => !r.IsRead).ToListAsync();
            foreach (var item in unread)
                item.IsRead = true;
            await _context.SaveChangesAsync();
            return Ok(new { success = true, count = unread.Count });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRequest(int id)
        {
            var existing = await _context.ClientRequests.FindAsync(id);
            if (existing == null) return NotFound();

            _context.ClientRequests.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private static string? NormalizeTelegram(string? value)
        {
            if (string.IsNullOrWhiteSpace(value)) return null;
            var trimmed = value.Trim();
            if (trimmed.StartsWith("https://t.me/", StringComparison.OrdinalIgnoreCase))
                trimmed = trimmed["https://t.me/".Length..];
            else if (trimmed.StartsWith("http://t.me/", StringComparison.OrdinalIgnoreCase))
                trimmed = trimmed["http://t.me/".Length..];
            else if (trimmed.StartsWith("t.me/", StringComparison.OrdinalIgnoreCase))
                trimmed = trimmed["t.me/".Length..];
            if (trimmed.StartsWith('@')) trimmed = trimmed[1..];
            var slash = trimmed.IndexOf('/');
            if (slash >= 0) trimmed = trimmed[..slash];
            trimmed = trimmed.Trim();
            return string.IsNullOrEmpty(trimmed) ? null : trimmed;
        }
    }
}
