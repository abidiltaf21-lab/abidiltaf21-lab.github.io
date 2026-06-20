// Program.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Infrastructer.Data;
using System.Net;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Identity;
using ReactApi.Domin.identityModel;

var builder = WebApplication.CreateBuilder(args);

// Register application services and infrastructure
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructure(builder.Configuration);  // includes Rate Limiter + Identity

builder.Services.AddControllers()
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

// ── Forwarded Headers (for Render Proxy) ─────────────────────────────────────────────
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// ── Rate Limiter Registration ──────────────────────────────────────────────────────────
builder.Services.AddRateLimiter(options =>
{
    // Auth endpoints: 5 requests per minute per IP
    options.AddPolicy("auth", context =>
    {
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            Window = TimeSpan.FromMinutes(1),
            PermitLimit = 5,
            QueueLimit = 0,
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst
        });
    });

    // Contact form: 3 submissions per hour per IP
    options.AddPolicy("contact", context =>
    {
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            Window = TimeSpan.FromHours(1),
            PermitLimit = 3,
            QueueLimit = 0,
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst
        });
    });

    // General API: 60 requests per minute per IP
    options.AddPolicy("api", context =>
    {
        var ip = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            Window = TimeSpan.FromMinutes(1),
            PermitLimit = 60,
            QueueLimit = 0,
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst
        });
    });

    // Global fallback — 429 response
    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = 429;
        context.HttpContext.Response.ContentType = "application/json";
        var retryAfter = context.Lease.TryGetMetadata(
            System.Threading.RateLimiting.MetadataName.RetryAfter, out var retry)
            ? (int)retry.TotalSeconds : 60;
        context.HttpContext.Response.Headers["Retry-After"] = retryAfter.ToString();
        await context.HttpContext.Response.WriteAsync(
            $"{{\"error\":\"Too many requests. Please wait {retryAfter} seconds and try again.\"}}",
            cancellationToken);
    };
});

// ── CORS ───────────────────────────────────────────────────────────────────────────────
var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();
var isDevelopment = builder.Environment.IsDevelopment();

// Removed the explicit throw to prevent startup crashes.
// The policy allows *.onrender.com and *.github.io by default.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
    {
        if (isDevelopment)
        {
            policy.SetIsOriginAllowed(origin =>
                origin.StartsWith("http://localhost", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("http://127.0.0.1", StringComparison.OrdinalIgnoreCase))
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            policy.SetIsOriginAllowed(origin => 
                    configuredOrigins.Contains(origin, StringComparer.OrdinalIgnoreCase) ||
                    origin.EndsWith(".onrender.com", StringComparison.OrdinalIgnoreCase) ||
                    origin.EndsWith(".github.io", StringComparison.OrdinalIgnoreCase))
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

// ── Build ──────────────────────────────────────────────────────────────────────────────
var app = builder.Build();

app.UseForwardedHeaders(); // Must be first to resolve real client IP

// ── Global Exception Handler ───────────────────────────────────────────────────────────
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.ContentType = "application/json";
        var feature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var ex      = feature?.Error;
        var status  = ex switch
        {
            UnauthorizedAccessException => 401,
            NotImplementedException     => 501,
            _                           => 500
        };
        context.Response.StatusCode = status;
        // Do NOT expose stack traces or internal messages in production
        var message = isDevelopment ? ex?.Message : "An internal error occurred.";
        await context.Response.WriteAsync(
            System.Text.Json.JsonSerializer.Serialize(new { error = message }));
    });
});

// ── HTTPS Redirection (Handled by Render at the edge) ─────────────────────────────────
if (!isDevelopment)
{
    app.UseHsts();
}

// ── Swagger (dev only unless explicitly enabled) ──────────────────────────────────────
bool showSwagger = isDevelopment ||
    builder.Configuration.GetValue<bool>("Security:EnableSwaggerInProduction", false);
if (showSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ── Security Headers ───────────────────────────────────────────────────────────────────
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;

    // Prevent clickjacking
    headers["X-Frame-Options"]        = "DENY";

    // Prevent MIME-type sniffing
    headers["X-Content-Type-Options"] = "nosniff";

    // XSS protection (legacy browsers)
    headers["X-XSS-Protection"]       = "1; mode=block";

    // Referrer information control
    headers["Referrer-Policy"]        = "strict-origin-when-cross-origin";

    // Disable unnecessary browser features
    headers["Permissions-Policy"]     = "camera=(), microphone=(), geolocation=(), payment=()";

    // Content Security Policy — adjust as your frontend CDNs require
    headers["Content-Security-Policy"] =
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net; " +
        "font-src 'self' https://fonts.gstatic.com data:; " +
        "img-src 'self' data: blob: https://res.cloudinary.com https://lh3.googleusercontent.com; " +
        "connect-src 'self'; " +
        "frame-ancestors 'none';";

    // HSTS
    if (!isDevelopment)
        headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload";

    await next();
});

// ── Rate Limiter ───────────────────────────────────────────────────────────────────────
app.UseRateLimiter();

// ── CORS ───────────────────────────────────────────────────────────────────────────────
app.UseCors("AllowOrigin");

// ── Auth ───────────────────────────────────────────────────────────────────────────────
app.UseAuthentication();
app.UseAuthorization();

// ── Database Setup ─────────────────────────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db     = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        // Try to ensure database is created (creates physical SQLite file or PostgreSQL database if missing)
        await db.Database.EnsureCreatedAsync();

        // Check if the main tables actually exist by querying AspNetUsers
        bool tablesExist = false;
        try
        {
            // Execute a simple query to see if the table exists
            await db.Database.ExecuteSqlRawAsync("SELECT 1 FROM \"AspNetUsers\" LIMIT 1");
            tablesExist = true;
        }
        catch
        {
            tablesExist = false;
        }

        if (!tablesExist)
        {
            logger.LogInformation("Database tables do not exist or are incomplete. Generating and executing DDL creation script...");
            var createScript = db.Database.GenerateCreateScript();
            
            // Split the script into individual SQL statements
            var statements = createScript.Split(new[] { ";\r\n", ";\n", ";\r" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var statement in statements)
            {
                var trimmed = statement.Trim();
                if (string.IsNullOrEmpty(trimmed)) continue;

                try
                {
                    await db.Database.ExecuteSqlRawAsync(trimmed);
                }
                catch (Exception stmtEx)
                {
                    // Ignore errors for individual statements (e.g. if table or index already exists)
                    logger.LogWarning("DDL statement execution skipped (might already exist): {Message}", stmtEx.Message);
                }
            }
            logger.LogInformation("Database tables check and creation completed.");
        }
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Database schema creation failed; continuing with schema ensurers.");
    }

    try
    {
        await ReactApi.Infrastructer.Data.InboxSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.ResumeSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.AiSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.OtpSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.NotificationSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.ResumeSchemaEnsurer.SeedDefaultsAsync(db);
        await ReactApi.Infrastructer.Data.PortfolioDataSeeder.SeedAsync(db);

        // Programmatically seed the admin user abidiltaf21@gmail.com
        try
        {
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            
            var adminEmail = "abidiltaf21@gmail.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                logger.LogInformation("Seeding default admin user: {Email}", adminEmail);
                adminUser = new ApplicationUser
                {
                    UserName = "Abid",
                    Email = adminEmail,
                    EmailConfirmed = true
                };
                
                // "Admin12345!" matches their password validation criteria:
                // >= 10 chars, uppercase, lowercase, digit, non-alphanumeric.
                var result = await userManager.CreateAsync(adminUser, "Admin12345!");
                if (result.Succeeded)
                {
                    var roleName = "Admin";
                    if (!await roleManager.RoleExistsAsync(roleName))
                    {
                        await roleManager.CreateAsync(new ApplicationRole { Name = roleName });
                    }
                    await userManager.AddToRoleAsync(adminUser, roleName);
                    logger.LogInformation("Admin user seeded successfully with email {Email} and password Admin12345!", adminEmail);
                }
                else
                {
                    logger.LogWarning("Failed to seed admin user: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
        }
        catch (Exception seedEx)
        {
            logger.LogWarning(seedEx, "Error seeding admin user programmatically.");
        }
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Schema ensurers failed; backend will start without full schema.");
    }
}

app.UseStaticFiles();
app.MapControllers();
app.Run();