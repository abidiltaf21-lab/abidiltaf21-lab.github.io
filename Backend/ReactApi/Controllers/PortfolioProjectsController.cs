using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace ReactApi.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class PortfolioProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PortfolioProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PortfolioProject>>> GetProjects()
        {
            return await _context.PortfolioProjects.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PortfolioProject>> GetProject(int id)
        {
            var project = await _context.PortfolioProjects.FindAsync(id);
            if (project == null) return NotFound();
            return project;
        }

        [HttpGet("featured")]
        public async Task<ActionResult<IEnumerable<PortfolioProject>>> GetFeaturedProjects()
        {
            return await _context.PortfolioProjects
                .Where(p => p.IsFeatured == true)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<PortfolioProject>> PostProject(PortfolioProject project)
        {
            _context.PortfolioProjects.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutProject(int id, PortfolioProject project)
        {
            if (id != project.Id) return BadRequest();
            _context.Entry(project).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.PortfolioProjects.FindAsync(id);
            if (project == null) return NotFound();
            _context.PortfolioProjects.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
