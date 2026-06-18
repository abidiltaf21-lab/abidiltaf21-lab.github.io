using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace ReactApi.Controllers
{
    [Route("api/pricing")]
    [ApiController]
    public class PricingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PricingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pricing>>> GetPricing()
        {
            return await _context.Pricings.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Pricing>> PostPricing(Pricing pricing)
        {
            _context.Pricings.Add(pricing);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPricing), new { id = pricing.Id }, pricing);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutPricing(int id, Pricing pricing)
        {
            if (id != pricing.Id) return BadRequest();
            _context.Entry(pricing).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
