using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApi.Controllers
{
    [Route("api/inbox")]
    [ApiController]
    public class ClientRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClientRequestsController(ApplicationDbContext context)
        {
            _context = context;
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
        public async Task<ActionResult<ClientRequest>> PostRequest([FromBody] CreateInboxMessageDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Request body is required." });

            var name = (dto.Name ?? string.Empty).Trim();
            var email = (dto.Email ?? string.Empty).Trim();
            var message = (dto.Message ?? string.Empty).Trim();

            if (string.IsNullOrEmpty(name))
                return BadRequest(new { message = "Name is required." });
            if (string.IsNullOrEmpty(email))
                return BadRequest(new { message = "Email is required." });
            if (string.IsNullOrEmpty(message))
                return BadRequest(new { message = "Message is required." });

            var clientRequest = new ClientRequest
            {
                Name = name,
                Email = email,
                Phone = string.IsNullOrWhiteSpace(dto.Phone) ? null : dto.Phone.Trim(),
                Telegram = NormalizeTelegram(dto.Telegram),
                Message = message,
                ProjectType = string.IsNullOrWhiteSpace(dto.ProjectType) ? "Inquiry from Website" : dto.ProjectType.Trim(),
                BudgetRange = string.IsNullOrWhiteSpace(dto.BudgetRange) ? null : dto.BudgetRange.Trim(),
                Status = string.IsNullOrWhiteSpace(dto.Status) ? "New" : dto.Status.Trim(),
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
            };

            try
            {
                _context.ClientRequests.Add(clientRequest);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Could not save your message. Ensure database migrations are applied.",
                    detail = ex.InnerException?.Message ?? ex.Message
                });
            }

            return CreatedAtAction(nameof(GetRequests), new { id = clientRequest.Id }, clientRequest);
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
