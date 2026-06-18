using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;

namespace ReactApi.Controllers
{
    [Route("api/resume")]
    [ApiController]
    public class ResumeEntriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResumeEntriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ResumeEntry>>> GetEntries(
            [FromQuery] string? type = null,
            [FromQuery] bool includeInactive = false)
        {
            var query = _context.ResumeEntries.AsQueryable();

            // Exclude entries that belong to a specific team member
            query = query.Where(e => e.TeamMemberId == null);

            if (!includeInactive)
                query = query.Where(e => e.IsActive);

            if (!string.IsNullOrWhiteSpace(type))
            {
                var normalized = type.Trim().ToLowerInvariant();
                query = query.Where(e => e.Type.ToLower() == normalized);
            }

            var list = await query
                .OrderBy(e => e.SortOrder)
                .ThenByDescending(e => e.Id)
                .ToListAsync();

            if (list.Count == 0)
            {
                await ResumeSchemaEnsurer.SeedDefaultsAsync(_context);
                list = await query
                    .OrderBy(e => e.SortOrder)
                    .ThenByDescending(e => e.Id)
                    .ToListAsync();
            }

            return list;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ResumeEntry>> GetEntry(int id)
        {
            var entry = await _context.ResumeEntries.FindAsync(id);
            if (entry == null) return NotFound();
            return entry;
        }

        [HttpPost]
        public async Task<ActionResult<ResumeEntry>> PostEntry(ResumeEntry entry)
        {
            if (string.IsNullOrWhiteSpace(entry.Type))
                return BadRequest("Type is required (experience or education).");

            entry.Type = entry.Type.Trim().ToLowerInvariant();
            if (entry.Type is not ("experience" or "education"))
                return BadRequest("Type must be 'experience' or 'education'.");

            _context.ResumeEntries.Add(entry);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetEntry), new { id = entry.Id }, entry);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEntry(int id, ResumeEntry entry)
        {
            if (id != entry.Id) return BadRequest();

            var existing = await _context.ResumeEntries.FindAsync(id);
            if (existing == null) return NotFound();

            existing.Type = string.IsNullOrWhiteSpace(entry.Type)
                ? existing.Type
                : entry.Type.Trim().ToLowerInvariant();
            existing.Title = entry.Title;
            existing.Subtitle = entry.Subtitle;
            existing.DateRange = entry.DateRange;
            existing.Description = entry.Description;
            existing.SortOrder = entry.SortOrder;
            existing.IsActive = entry.IsActive;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEntry(int id)
        {
            var entry = await _context.ResumeEntries.FindAsync(id);
            if (entry == null) return NotFound();

            _context.ResumeEntries.Remove(entry);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
