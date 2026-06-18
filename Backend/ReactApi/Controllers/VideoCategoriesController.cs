using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoCategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public VideoCategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/VideoCategories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<VideoCategory>>> GetVideoCategories()
        {
            return await _context.VideoCategories.ToListAsync();
        }

        // GET: api/VideoCategories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<VideoCategory>> GetVideoCategory(int id)
        {
            var videoCategory = await _context.VideoCategories.FindAsync(id);

            if (videoCategory == null)
            {
                return NotFound();
            }

            return videoCategory;
        }

        // PUT: api/VideoCategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVideoCategory(int id, VideoCategory videoCategory)
        {
            if (id != videoCategory.Id)
            {
                return BadRequest();
            }

            _context.Entry(videoCategory).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VideoCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/VideoCategories
        [HttpPost]
        public async Task<ActionResult<VideoCategory>> PostVideoCategory(VideoCategory videoCategory)
        {
            _context.VideoCategories.Add(videoCategory);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVideoCategory", new { id = videoCategory.Id }, videoCategory);
        }

        // DELETE: api/VideoCategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVideoCategory(int id)
        {
            var videoCategory = await _context.VideoCategories.FindAsync(id);
            if (videoCategory == null)
            {
                return NotFound();
            }

            _context.VideoCategories.Remove(videoCategory);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool VideoCategoryExists(int id)
        {
            return _context.VideoCategories.Any(e => e.Id == id);
        }
    }
}
