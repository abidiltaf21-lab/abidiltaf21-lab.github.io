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
    [Route("api/visitors")]
    [ApiController]
    public class VisitorsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        private static readonly Dictionary<string, string> SectionLabels = new(StringComparer.OrdinalIgnoreCase)
        {
            ["home"] = "Hero / Banner",
            ["services"] = "Services",
            ["showreel"] = "Showreel",
            ["portfolio"] = "Portfolio",
            ["stats"] = "Skills & Stats",
            ["team"] = "Team",
            ["reviews"] = "Reviews",
            ["calculator"] = "Pricing Calculator",
            ["pricing"] = "Pricing Packages",
            ["about"] = "About",
            ["contact"] = "Contact",
        };

        private static readonly Dictionary<string, string> PageLabels = new(StringComparer.OrdinalIgnoreCase)
        {
            ["/"] = "Home",
            ["/home-dark"] = "Home (Dark)",
            ["/projects"] = "Projects",
            ["/contact"] = "Contact",
            ["/pricing"] = "Pricing",
            ["/service"] = "Services",
            ["/resume"] = "Resume",
            ["/login"] = "Login",
        };

        public VisitorsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> LogVisit([FromBody] VisitorLog log)
        {
            var ip = Request.Headers["X-Forwarded-For"].FirstOrDefault()
                     ?? HttpContext.Connection.RemoteIpAddress?.ToString()
                     ?? "unknown";

            log.IpAddress = ip;
            log.VisitedAt = DateTime.UtcNow;

            _context.VisitorLogs.Add(log);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }

        [HttpGet("filter-options")]
        public async Task<IActionResult> GetFilterOptions([FromQuery] string? country)
        {
            var query = _context.VisitorLogs.AsNoTracking().AsQueryable();

            var countries = await query
                .Where(v => v.Country != null && v.Country != "")
                .GroupBy(v => new { v.Country, v.CountryCode })
                .Select(g => new
                {
                    country = g.Key.Country,
                    countryCode = g.Key.CountryCode ?? "XX",
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .ToListAsync();

            var cityQuery = query.Where(v => v.City != null && v.City != "");
            if (!string.IsNullOrWhiteSpace(country))
            {
                cityQuery = cityQuery.Where(v => v.Country == country);
            }

            var cities = await cityQuery
                .GroupBy(v => new { v.Country, v.City })
                .Select(g => new
                {
                    country = g.Key.Country ?? "Unknown",
                    city = g.Key.City,
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .ToListAsync();

            var pagesRaw = await query
                .GroupBy(v => v.Page ?? "/")
                .Select(g => new
                {
                    page = g.Key,
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .ToListAsync();

            var pages = pagesRaw.Select(p => new
            {
                page = p.page,
                label = PageLabels.TryGetValue(p.page, out var lbl) ? lbl : p.page,
                visits = p.visits
            }).ToList();

            var sectionsRaw = await query
                .Where(v => v.Section != null && v.Section != "")
                .GroupBy(v => v.Section!)
                .Select(g => new
                {
                    section = g.Key,
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .ToListAsync();

            var sections = sectionsRaw.Select(s => new
            {
                section = s.section,
                label = SectionLabels.TryGetValue(s.section, out var lbl) ? lbl : s.section,
                visits = s.visits
            }).ToList();

            return Ok(new { countries, cities, pages, sections });
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats(
            [FromQuery] string? country,
            [FromQuery] string? city,
            [FromQuery] string? page,
            [FromQuery] string? section,
            [FromQuery] DateTime? dateFrom,
            [FromQuery] DateTime? dateTo,
            [FromQuery] string? period)
        {
            var (fromUtc, toUtc) = ResolveDateRange(dateFrom, dateTo, period);

            var query = _context.VisitorLogs.AsNoTracking().AsQueryable();

            if (fromUtc.HasValue)
                query = query.Where(v => v.VisitedAt >= fromUtc.Value);
            if (toUtc.HasValue)
                query = query.Where(v => v.VisitedAt <= toUtc.Value);
            if (!string.IsNullOrWhiteSpace(country))
                query = query.Where(v => v.Country == country);
            if (!string.IsNullOrWhiteSpace(city))
                query = query.Where(v => v.City == city);
            if (!string.IsNullOrWhiteSpace(page))
                query = query.Where(v => (v.Page ?? "/") == page);
            if (!string.IsNullOrWhiteSpace(section))
                query = query.Where(v => v.Section == section);

            var logs = await query.ToListAsync();

            var total = logs.Count;

            var uniqueVisitors = logs
                .Select(v => !string.IsNullOrWhiteSpace(v.SessionId) ? v.SessionId : v.IpAddress ?? "unknown")
                .Distinct()
                .Count();

            var byCountry = logs
                .GroupBy(v => new { v.Country, v.CountryCode })
                .Select(g => new
                {
                    country = g.Key.Country ?? "Unknown",
                    countryCode = g.Key.CountryCode ?? "XX",
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .Take(15)
                .ToList();

            var byCity = logs
                .Where(v => !string.IsNullOrWhiteSpace(v.City))
                .GroupBy(v => new { v.Country, v.City })
                .Select(g => new
                {
                    country = g.Key.Country ?? "Unknown",
                    city = g.Key.City ?? "Unknown",
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .Take(20)
                .ToList();

            var byPage = logs
                .GroupBy(v => v.Page ?? "/")
                .Select(g => new
                {
                    page = g.Key,
                    label = PageLabels.TryGetValue(g.Key, out var lbl) ? lbl : g.Key,
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .Take(15)
                .ToList();

            var bySection = logs
                .Where(v => !string.IsNullOrWhiteSpace(v.Section))
                .GroupBy(v => v.Section!)
                .Select(g => new
                {
                    section = g.Key,
                    label = SectionLabels.TryGetValue(g.Key, out var lbl) ? lbl : g.Key,
                    visits = g.Count()
                })
                .OrderByDescending(x => x.visits)
                .Take(15)
                .ToList();

            var chartFrom = fromUtc ?? DateTime.UtcNow.AddDays(-30);
            var chartTo = toUtc ?? DateTime.UtcNow;

            var byDay = logs
                .Where(v => v.VisitedAt >= chartFrom && v.VisitedAt <= chartTo)
                .GroupBy(v => v.VisitedAt.Date)
                .Select(g => new
                {
                    date = g.Key.ToString("MMM dd"),
                    sortKey = g.Key,
                    visits = g.Count()
                })
                .OrderBy(x => x.sortKey)
                .Select(x => new { x.date, x.visits })
                .ToList();

            var recent = logs
                .OrderByDescending(v => v.VisitedAt)
                .Take(50)
                .Select(v => new
                {
                    v.Country,
                    v.CountryCode,
                    v.City,
                    v.Page,
                    v.Section,
                    sectionLabel = !string.IsNullOrWhiteSpace(v.Section) && SectionLabels.TryGetValue(v.Section, out var sl)
                        ? sl
                        : v.Section,
                    pageLabel = PageLabels.TryGetValue(v.Page ?? "/", out var pl) ? pl : v.Page,
                    visitedAt = v.VisitedAt.ToString("yyyy-MM-dd HH:mm")
                })
                .ToList();

            var appliedFilters = new
            {
                country,
                city,
                page,
                section,
                dateFrom = fromUtc?.ToString("yyyy-MM-dd"),
                dateTo = toUtc?.ToString("yyyy-MM-dd"),
                period = string.IsNullOrWhiteSpace(period) ? (fromUtc.HasValue || toUtc.HasValue ? "custom" : "30d") : period
            };

            return Ok(new
            {
                total,
                uniqueVisitors,
                byCountry,
                byCity,
                byPage,
                bySection,
                byDay,
                recent,
                appliedFilters
            });
        }

        private static (DateTime? from, DateTime? to) ResolveDateRange(DateTime? dateFrom, DateTime? dateTo, string? period)
        {
            var now = DateTime.UtcNow;
            var endOfToday = now.Date.AddDays(1).AddTicks(-1);

            if (!string.IsNullOrWhiteSpace(period) && period != "custom" && period != "all")
            {
                return period.ToLowerInvariant() switch
                {
                    "today" => (now.Date, endOfToday),
                    "7d" => (now.Date.AddDays(-6), endOfToday),
                    "30d" => (now.Date.AddDays(-29), endOfToday),
                    "90d" => (now.Date.AddDays(-89), endOfToday),
                    _ => (now.Date.AddDays(-29), endOfToday)
                };
            }

            if (period == "all")
                return (null, null);

            DateTime? from = dateFrom.HasValue
                ? DateTime.SpecifyKind(dateFrom.Value.Date, DateTimeKind.Utc)
                : null;
            DateTime? to = dateTo.HasValue
                ? DateTime.SpecifyKind(dateTo.Value.Date.AddDays(1).AddTicks(-1), DateTimeKind.Utc)
                : null;

            if (from == null && to == null && (period == null || period == "custom"))
            {
                return (now.Date.AddDays(-29), endOfToday);
            }

            return (from, to);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? country,
            [FromQuery] string? city,
            [FromQuery] string? page,
            [FromQuery] string? section,
            [FromQuery] DateTime? dateFrom,
            [FromQuery] DateTime? dateTo,
            [FromQuery] string? period)
        {
            var (fromUtc, toUtc) = ResolveDateRange(dateFrom, dateTo, period);
            var query = _context.VisitorLogs.AsNoTracking().AsQueryable();

            if (fromUtc.HasValue) query = query.Where(v => v.VisitedAt >= fromUtc.Value);
            if (toUtc.HasValue) query = query.Where(v => v.VisitedAt <= toUtc.Value);
            if (!string.IsNullOrWhiteSpace(country)) query = query.Where(v => v.Country == country);
            if (!string.IsNullOrWhiteSpace(city)) query = query.Where(v => v.City == city);
            if (!string.IsNullOrWhiteSpace(page)) query = query.Where(v => (v.Page ?? "/") == page);
            if (!string.IsNullOrWhiteSpace(section)) query = query.Where(v => v.Section == section);

            var logs = await query
                .OrderByDescending(v => v.VisitedAt)
                .Take(500)
                .ToListAsync();
            return Ok(logs);
        }
    }
}
