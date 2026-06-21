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

                // Retrieve settings BEFORE launching the background task to avoid disposed DbContext issues
                var settings = await _context.SiteSettings.AsNoTracking().FirstOrDefaultAsync();
                if (settings != null)
                {
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            if (settings.NotifyTelegramEnabled)
                                await SendTelegramNotificationAsync(settings, clientRequest);

                            if (settings.NotifyEmailEnabled)
                                await SendEmailNotificationAsync(settings, clientRequest);
                        }
                        catch (Exception notifEx)
                        {
                            Console.WriteLine($"[NOTIFICATION ERROR] {notifEx.Message}");
                        }
                    });
                }
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

            var html = $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family:Plus Jakarta Sans,sans-serif;background:#0a0b10;padding:32px;margin:0;'>
  <div style='max-width:520px;margin:0 auto;background:#12141e;border-radius:20px;
              box-shadow:0 8px 40px rgba(0,0,0,0.5);overflow:hidden;border:1px solid rgba(255,255,255,0.07);'>
    <!-- Header -->
    <div style='background:linear-gradient(135deg,#ffae00,#f54200);padding:28px 32px;text-align:center;'>
      <h1 style='color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.02em;'>
        🔔 SmooothPixel Studio
      </h1>
      <p style='color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;'>New Client Inquiry Received</p>
    </div>
    <!-- Body -->
    <div style='padding:28px 32px;'>
      <p style='color:#94a3b8;font-size:14px;margin:0 0 20px;'>A new message was submitted through your website contact form:</p>

      <!-- Info Table -->
      <table style='width:100%;border-collapse:collapse;'>
        <tr>
          <td style='padding:10px 12px;background:#1a1d2a;border-radius:8px 8px 0 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid rgba(255,255,255,0.04);'>👤 Name</td>
          <td style='padding:10px 12px;background:#1a1d2a;border-radius:8px 8px 0 0;color:#e2e8f0;font-size:14px;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.04);'>{request.Name}</td>
        </tr>
        <tr>
          <td style='padding:10px 12px;background:#161827;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid rgba(255,255,255,0.04);'>📧 Email</td>
          <td style='padding:10px 12px;background:#161827;color:#ffae00;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.04);'>{request.Email}</td>
        </tr>
        <tr>
          <td style='padding:10px 12px;background:#1a1d2a;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid rgba(255,255,255,0.04);'>📞 Phone</td>
          <td style='padding:10px 12px;background:#1a1d2a;color:#e2e8f0;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.04);'>{request.Phone ?? "N/A"}</td>
        </tr>
        <tr>
          <td style='padding:10px 12px;background:#161827;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid rgba(255,255,255,0.04);'>✈️ Telegram</td>
          <td style='padding:10px 12px;background:#161827;color:#e2e8f0;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.04);'>{(request.Telegram != null ? "@" + request.Telegram : "N/A")}</td>
        </tr>
        <tr>
          <td style='padding:10px 12px;background:#1a1d2a;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid rgba(255,255,255,0.04);'>💼 Project Type</td>
          <td style='padding:10px 12px;background:#1a1d2a;color:#e2e8f0;font-size:14px;border-bottom:1px solid rgba(255,255,255,0.04);'>{request.ProjectType ?? "N/A"}</td>
        </tr>
        <tr>
          <td style='padding:10px 12px;background:#161827;border-radius:0 0 0 8px;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;'>💰 Budget</td>
          <td style='padding:10px 12px;background:#161827;border-radius:0 0 8px 0;color:#4ade80;font-size:14px;font-weight:600;'>{request.BudgetRange ?? "N/A"}</td>
        </tr>
      </table>

      <!-- Message -->
      <div style='margin-top:20px;background:#1a1d2a;border-radius:12px;padding:16px 20px;border-left:3px solid #ffae00;'>
        <p style='color:#64748b;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 8px;'>💬 Message</p>
        <p style='color:#cbd5e1;font-size:14px;line-height:1.6;margin:0;white-space:pre-wrap;'>{request.Message}</p>
      </div>

      <!-- CTA -->
      <div style='margin-top:24px;text-align:center;'>
        <a href='https://abidiltaf21-lab.github.io/admin/inbox'
           style='display:inline-block;background:linear-gradient(135deg,#ffae00,#f54200);
                  color:#fff;font-weight:700;font-size:14px;padding:12px 28px;
                  border-radius:10px;text-decoration:none;letter-spacing:0.01em;'>
          View in Admin Panel →
        </a>
      </div>
    </div>
    <!-- Footer -->
    <div style='background:#0d0f1a;padding:16px 32px;text-align:center;border-top:1px solid rgba(255,255,255,0.04);'>
      <p style='color:#475569;font-size:11px;margin:0;'>
        © {DateTime.UtcNow.Year} SmooothPixel Studio · Automated Notification
      </p>
    </div>
  </div>
</body>
</html>";

            using (var mail = new System.Net.Mail.MailMessage())
            {
                mail.From = new System.Net.Mail.MailAddress(fromEmail, "SmooothPixel Studio");
                mail.To.Add(toEmail);
                mail.Subject = $"🔔 New Inquiry from {request.Name} — SmooothPixel Studio";
                mail.Body = html;
                mail.IsBodyHtml = true;

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
