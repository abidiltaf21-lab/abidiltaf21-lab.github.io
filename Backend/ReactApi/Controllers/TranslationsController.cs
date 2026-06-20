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
    [Route("api/[controller]")]
    [ApiController]
    public class TranslationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TranslationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Translation>>> GetTranslations()
        {
            return await _context.Translations.ToListAsync();
        }

        [HttpGet("dictionary")]
        public async Task<ActionResult<IDictionary<string, IDictionary<string, string>>>> GetTranslationsDictionary()
        {
            var list = await _context.Translations.ToListAsync();
            var dict = new Dictionary<string, IDictionary<string, string>>(StringComparer.OrdinalIgnoreCase);

            foreach (var group in list.GroupBy(t => t.LanguageCode))
            {
                var langDict = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                foreach (var t in group)
                {
                    langDict[t.Key] = t.Value;
                }
                dict[group.Key] = langDict;
            }

            return dict;
        }

        [HttpPost]
        public async Task<ActionResult<Translation>> PostTranslation(Translation translation)
        {
            if (string.IsNullOrWhiteSpace(translation.LanguageCode) || string.IsNullOrWhiteSpace(translation.Key))
            {
                return BadRequest("LanguageCode and Key are required.");
            }

            var existing = await _context.Translations
                .FirstOrDefaultAsync(t => t.LanguageCode.ToLower() == translation.LanguageCode.ToLower() && t.Key.ToLower() == translation.Key.ToLower());

            if (existing != null)
            {
                existing.Value = translation.Value;
                _context.Entry(existing).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return Ok(existing);
            }

            _context.Translations.Add(translation);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTranslations), new { id = translation.Id }, translation);
        }

        [HttpPost("bulk")]
        public async Task<IActionResult> PostBulkTranslations([FromBody] List<Translation> translations)
        {
            if (translations == null || !translations.Any())
            {
                return BadRequest("No translations provided.");
            }

            foreach (var t in translations)
            {
                if (string.IsNullOrWhiteSpace(t.LanguageCode) || string.IsNullOrWhiteSpace(t.Key))
                {
                    continue; // Skip invalid entries
                }

                var existing = await _context.Translations
                    .FirstOrDefaultAsync(x => x.LanguageCode.ToLower() == t.LanguageCode.ToLower() && x.Key.ToLower() == t.Key.ToLower());

                if (existing != null)
                {
                    existing.Value = t.Value;
                    _context.Entry(existing).State = EntityState.Modified;
                }
                else
                {
                    _context.Translations.Add(t);
                }
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTranslation(int id)
        {
            var translation = await _context.Translations.FindAsync(id);
            if (translation == null)
            {
                return NotFound();
            }

            _context.Translations.Remove(translation);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
