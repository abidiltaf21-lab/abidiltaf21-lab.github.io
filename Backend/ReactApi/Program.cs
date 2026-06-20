// Program.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Infrastructer.Data;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Register application services and infrastructure
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructure(builder.Configuration);  // includes Rate Limiter + Identity

builder.Services.AddControllers(options =>
{
    // Require HTTPS globally in production via filter (belt-and-suspenders)
    if (!builder.Environment.IsDevelopment())
        options.Filters.Add(new RequireHttpsAttribute());
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

// ── CORS ───────────────────────────────────────────────────────────────────────────────
var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();
var isDevelopment = builder.Environment.IsDevelopment();

if (!isDevelopment && configuredOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "Production deployment requires Cors:AllowedOrigins to be set. " +
        "Set Cors__AllowedOrigins__0..N env vars or appsettings.Production.json.");
}

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
            policy.WithOrigins(configuredOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

// ── Build ──────────────────────────────────────────────────────────────────────────────
var app = builder.Build();

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

// ── HTTPS Redirection (production only) ───────────────────────────────────────────────
if (!isDevelopment)
{
    app.UseHttpsRedirection();
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

    // HSTS — only sent over HTTPS, already handled by UseHsts() above but belt-and-suspenders
    if (context.Request.IsHttps || !isDevelopment)
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
        if (app.Environment.IsProduction() || db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            await db.Database.EnsureCreatedAsync();
        else
            await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "EF MigrateAsync failed; continuing with schema ensurers.");
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
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Schema ensurers failed; backend will start without full schema.");
    }
}

app.UseStaticFiles();
app.MapControllers();
app.Run();