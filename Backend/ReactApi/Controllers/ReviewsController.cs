using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ReactApi.Controllers
{
    [Route("api/reviews")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReviewsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            return await _context.Reviews.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Review>> PostReview(Review review)
        {
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetReviews), new { id = review.Id }, review);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutReview(int id, Review review)
        {
            var existing = await _context.Reviews.FindAsync(id);
            if (existing == null) return NotFound();

            // Safely update only provided fields
            if (!string.IsNullOrEmpty(review.Author)) existing.Author = review.Author;
            if (!string.IsNullOrEmpty(review.Text)) existing.Text = review.Text;
            if (review.Rating > 0) existing.Rating = review.Rating;
            if (review.Project != null) existing.Project = review.Project;
            if (review.Image != null) existing.Image = review.Image;
            if (review.Company != null) existing.Company = review.Company;
            if (review.Website != null) existing.Website = review.Website;
            if (review.SocialLink != null) existing.SocialLink = review.SocialLink;
            if (!string.IsNullOrEmpty(review.Status)) existing.Status = review.Status;
            existing.IsApproved = review.IsApproved;

            _context.Entry(existing).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var review = await _context.Reviews.FindAsync(id);
            if (review == null) return NotFound();
            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
