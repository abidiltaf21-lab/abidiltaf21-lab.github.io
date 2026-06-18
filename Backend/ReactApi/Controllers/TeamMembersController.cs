using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace ReactApi.Controllers
{
    [Route("api/team")]
    [ApiController]
    public class TeamMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeamMembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamMember>>> GetTeam()
        {
            var members = await _context.TeamMembers
                .Include(t => t.ResumeEntries)
                .OrderBy(t => t.SortOrder)
                .ToListAsync();

            // Sort nested ResumeEntries in memory since EF Core Include ordering can be complex
            foreach (var member in members)
            {
                if (member.ResumeEntries != null)
                {
                    member.ResumeEntries = member.ResumeEntries
                        .OrderBy(r => r.SortOrder)
                        .ThenByDescending(r => r.Id)
                        .ToList();
                }
            }

            return members;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeamMember>> GetMember(int id)
        {
            var member = await _context.TeamMembers
                .Include(t => t.ResumeEntries)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (member == null) return NotFound();

            if (member.ResumeEntries != null)
            {
                member.ResumeEntries = member.ResumeEntries
                    .OrderBy(r => r.SortOrder)
                    .ThenByDescending(r => r.Id)
                    .ToList();
            }

            return member;
        }

        [HttpPost]
        public async Task<ActionResult<TeamMember>> PostMember(TeamMember member)
        {
            // Normalize resume entries before adding
            if (member.ResumeEntries != null)
            {
                member.ResumeEntries = member.ResumeEntries
                    .Where(entry => !string.IsNullOrWhiteSpace(entry.Type))
                    .ToList();

                foreach (var entry in member.ResumeEntries)
                {
                    entry.Type = entry.Type.Trim().ToLowerInvariant();
                    entry.TeamMember = member;
                }
            }

            _context.TeamMembers.Add(member);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMember), new { id = member.Id }, new { id = member.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutMember(int id, TeamMember member)
        {
            if (id != member.Id) return BadRequest();

            var existing = await _context.TeamMembers
                .Include(t => t.ResumeEntries)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (existing == null) return NotFound();

            // Update member properties
            existing.Name = member.Name;
            existing.Role = member.Role;
            existing.Image = member.Image;
            existing.Bio = member.Bio;
            existing.Twitter = member.Twitter;
            existing.Linkedin = member.Linkedin;
            existing.Instagram = member.Instagram;
            existing.Skills = member.Skills;
            existing.SortOrder = member.SortOrder;
            existing.IsActive = member.IsActive;

            // Merge ResumeEntries
            var incomingEntries = member.ResumeEntries
                ?.Where(entry => !string.IsNullOrWhiteSpace(entry.Type))
                .ToList() ?? new List<ResumeEntry>();
            var incomingIds = incomingEntries.Select(r => r.Id).ToList();

            // 1. Remove entries that are not in incoming payload
            var toRemove = existing.ResumeEntries
                .Where(r => !incomingIds.Contains(r.Id))
                .ToList();
            foreach (var item in toRemove)
            {
                _context.ResumeEntries.Remove(item);
            }

            // 2. Add or update incoming entries
            foreach (var incoming in incomingEntries)
            {
                if (string.IsNullOrWhiteSpace(incoming.Type)) continue;
                incoming.Type = incoming.Type.Trim().ToLowerInvariant();

                if (incoming.Id == 0)
                {
                    // Add new ResumeEntry
                    existing.ResumeEntries.Add(new ResumeEntry
                    {
                        Type = incoming.Type,
                        Title = incoming.Title,
                        Subtitle = incoming.Subtitle,
                        DateRange = incoming.DateRange,
                        Description = incoming.Description,
                        SortOrder = incoming.SortOrder,
                        IsActive = incoming.IsActive,
                        TeamMemberId = existing.Id,
                        TeamMember = existing
                    });
                }
                else
                {
                    // Update existing ResumeEntry
                    var existingEntry = existing.ResumeEntries.FirstOrDefault(r => r.Id == incoming.Id);
                    if (existingEntry != null)
                    {
                        existingEntry.Type = incoming.Type;
                        existingEntry.Title = incoming.Title;
                        existingEntry.Subtitle = incoming.Subtitle;
                        existingEntry.DateRange = incoming.DateRange;
                        existingEntry.Description = incoming.Description;
                        existingEntry.SortOrder = incoming.SortOrder;
                        existingEntry.IsActive = incoming.IsActive;
                        existingEntry.TeamMemberId = existing.Id;
                        existingEntry.TeamMember = existing;
                    }
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamMemberExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMember(int id)
        {
            var member = await _context.TeamMembers
                .Include(t => t.ResumeEntries)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (member == null) return NotFound();

            _context.TeamMembers.Remove(member);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool TeamMemberExists(int id)
        {
            return _context.TeamMembers.Any(e => e.Id == id);
        }
    }
}
