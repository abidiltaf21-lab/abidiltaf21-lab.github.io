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
    public class SocialAccountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SocialAccountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SocialAccounts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SocialAccount>>> GetSocialAccounts()
        {
            return await _context.SocialAccounts.ToListAsync();
        }

        // GET: api/SocialAccounts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SocialAccount>> GetSocialAccount(int id)
        {
            var socialAccount = await _context.SocialAccounts.FindAsync(id);

            if (socialAccount == null)
            {
                return NotFound();
            }

            return socialAccount;
        }

        // PUT: api/SocialAccounts/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSocialAccount(int id, SocialAccount socialAccount)
        {
            if (id != socialAccount.Id)
            {
                return BadRequest();
            }

            // Entity Framework will track this as modified
            _context.Entry(socialAccount).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await SocialAccountExists(id))
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

        // POST: api/SocialAccounts
        [HttpPost]
        public async Task<ActionResult<SocialAccount>> PostSocialAccount(SocialAccount socialAccount)
        {
            _context.SocialAccounts.Add(socialAccount);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSocialAccount), new { id = socialAccount.Id }, socialAccount);
        }

        // DELETE: api/SocialAccounts/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSocialAccount(int id)
        {
            var socialAccount = await _context.SocialAccounts.FindAsync(id);
            if (socialAccount == null)
            {
                return NotFound();
            }

            _context.SocialAccounts.Remove(socialAccount);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<bool> SocialAccountExists(int id)
        {
            return await _context.SocialAccounts.AnyAsync(e => e.Id == id);
        }
    }
}
