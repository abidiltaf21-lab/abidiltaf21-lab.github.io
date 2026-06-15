using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System.Threading.Tasks;
using System.Linq;

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteSettingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SiteSettingsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<SiteSetting>> GetSettings()
        {
            var setting = await _context.SiteSettings.FirstOrDefaultAsync();
            if (setting == null)
            {
                setting = new SiteSetting { SiteName = "SmoothPixel" };
                _context.SiteSettings.Add(setting);
                await _context.SaveChangesAsync();
            }
            return setting;
        }

        [HttpPut]
        public async Task<IActionResult> PutSettings(SiteSetting setting)
        {
            var existing = await _context.SiteSettings.FirstOrDefaultAsync();
            if (existing == null)
            {
                _context.SiteSettings.Add(setting);
            }
            else
            {
                setting.Id = existing.Id;
                _context.Entry(existing).CurrentValues.SetValues(setting);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
