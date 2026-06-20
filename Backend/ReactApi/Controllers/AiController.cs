using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Infrastructer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace ReactApi.Controllers;

[Route("api/ai")]
[ApiController]
public class AiController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IHttpClientFactory _httpClientFactory;

    public AiController(ApplicationDbContext context, IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _httpClientFactory = httpClientFactory;
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] ChatRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest(new { error = "Message cannot be empty" });
        }

        // Fetch AI Settings
        var settings = await _context.SiteSettings.FirstOrDefaultAsync();
        var aiEnabled = settings?.AiEnabled ?? true;
        
        if (!aiEnabled)
        {
            return BadRequest(new { error = "AI Assistant is currently disabled by the administrator." });
        }

        var apiKey = settings?.AiApiKey;
        var systemPrompt = settings?.AiSystemPrompt ?? "You are an AI Assistant for SmooothPixel, a premium 3D animation and explainer video studio.";
        var telegramLink = settings?.TelegramLink ?? "https://t.me/SmooothPixel";

        // If no API key, execute local database keyword-matching fallback
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            var fallbackResponse = await GetLocalFallbackResponseAsync(request.Message.ToLower(), telegramLink);
            return Ok(new { response = fallbackResponse, isFallback = true });
        }

        // Call Gemini API
        try
        {
            var client = _httpClientFactory.CreateClient();
            var url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

            // Map user-defined role/parts into Gemini structure
            var contents = new List<object>();

            if (request.History != null)
            {
                foreach (var h in request.History)
                {
                    contents.Add(new
                    {
                        role = h.Role.ToLower() == "user" ? "user" : "model",
                        parts = new[] { new { text = h.Text } }
                    });
                }
            }

            // Add latest message
            contents.Add(new
            {
                role = "user",
                parts = new[] { new { text = request.Message } }
            });

            var geminiRequest = new
            {
                contents = contents,
                systemInstruction = new
                {
                    parts = new[] { new { text = systemPrompt } }
                }
            };

            var response = await client.PostAsJsonAsync(url, geminiRequest);
            if (!response.IsSuccessStatusCode)
            {
                var errContent = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, new { error = "Gemini API call failed", details = errContent });
            }

            var geminiResponse = await response.Content.ReadFromJsonAsync<JsonElement>();
            
            // Extract the generated text
            string? reply = null;
            try
            {
                reply = geminiResponse
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();
            }
            catch
            {
                // Fallback text if JSON parsing of Gemini output fails
                reply = "I couldn't format the AI response. For immediate assistance, please check our FAQ or contact us directly on Telegram.";
            }

            return Ok(new { response = reply, isFallback = false });
        }
        catch (Exception ex)
        {
            // If the Gemini API fails, fall back to local database search rather than showing a 500 error!
            var fallbackResponse = await GetLocalFallbackResponseAsync(request.Message.ToLower(), telegramLink);
            return Ok(new { response = fallbackResponse, isFallback = true, warning = ex.Message });
        }
    }

    private async Task<string> GetLocalFallbackResponseAsync(string query, string telegramLink)
    {
        // 1. Check for Pricing / Packages keywords
        if (query.Contains("price") || query.Contains("pricing") || query.Contains("cost") || query.Contains("package") || query.Contains("plan"))
        {
            var pricing = await _context.Pricings.FirstOrDefaultAsync();
            var services = await _context.Services.ToListAsync();
            
            var servicePrices = "";
            if (services.Any(s => s.Price > 0))
            {
                servicePrices = "\nHere are some of our service starting prices:\n" + 
                                string.Join("\n", services.Where(s => s.Price > 0).Select(s => $"- **{s.Title}**: Starting from ${s.Price}"));
            }

            if (pricing != null)
            {
                return $"Our animation and production rates depend on service types and complexity:\n" +
                       $"- **Motion Graphics**: ${pricing.RateMotion}/sec\n" +
                       $"- **Explainer Videos**: ${pricing.RateExplainer}/sec\n" +
                       $"- **Video Production**: ${pricing.RateProduction}/sec\n" +
                       $"- **3D Animation**: ${pricing.RateThreeD}/sec\n" +
                       $"{servicePrices}\n\n" +
                       $"We also have an interactive budget calculator on our website! For a precise custom quote, contact us on Telegram: {telegramLink}";
            }
            return $"We offer customized fixed plans and interactive pricing estimates. Please contact us on Telegram ({telegramLink}) for a tailored quote!";
        }

        // 2. Check for Services / Expertise keywords
        if (query.Contains("service") || query.Contains("expertise") || query.Contains("work") || query.Contains("animate") || query.Contains("video"))
        {
            var services = await _context.Services.ToListAsync();
            if (services.Any())
            {
                var list = string.Join("\n", services.Select(s => $"- **{s.Title}**: {s.Text}"));
                return $"Our services and animation expertise include:\n{list}\n\nWe specialize in premium 3D animations, SaaS explainers, and commercial video production.";
            }
            return "We specialize in premium 3D animation, SaaS explainers, custom motion graphics, and cinematic video production for brands.";
        }

        // 3. Check for Team / Roster keywords
        if (query.Contains("team") || query.Contains("member") || query.Contains("who are you"))
        {
            var team = await _context.TeamMembers.ToListAsync();
            if (team.Any())
            {
                var members = string.Join(", ", team.Select(t => $"{t.Name} ({t.Role})"));
                return $"Our creative team consists of: {members}. We are dedicated to delivering premium visual results!";
            }
            return "Our studio consists of senior 3D animators, motion designers, and creative directors who collaborate to produce outstanding visuals.";
        }

        // 4. Check for Reviews / Testimonials keywords
        if (query.Contains("review") || query.Contains("testimonial") || query.Contains("rating") || query.Contains("feedback"))
        {
            var reviews = await _context.Reviews.Where(r => r.IsApproved).ToListAsync();
            if (reviews.Any())
            {
                var summary = string.Join("\n", reviews.Take(3).Select(r => $"- \"{r.Text}\" — **{r.Author}**"));
                return $"Here is some feedback from our verified clients:\n{summary}\n\nOur average Google review rating is 5.0 stars!";
            }
            return "We have worked with top-tier brands and have a 5.0 star average rating on Google Reviews. Our clients appreciate our speed, quality, and communication.";
        }

        // 5. Check for Contact / Message keywords
        if (query.Contains("contact") || query.Contains("telegram") || query.Contains("email") || query.Contains("hire") || query.Contains("order"))
        {
            return $"You can contact us directly or place custom orders on Telegram: {telegramLink}. We look forward to hearing from you!";
        }

        // Default friendly fallback
        return $"Hello! I am the SmooothPixel Assistant. I can help you with questions about our **services**, **pricing plans**, **team**, or **client reviews**.\n\nYou can also reach out to our team directly on Telegram: {telegramLink}";
    }
}

public class ChatRequest
{
    public required string Message { get; set; }
    public List<ChatMessage>? History { get; set; }
}

public class ChatMessage
{
    public required string Role { get; set; } // "user" or "model"
    public required string Text { get; set; }
}
