// Program.cs
using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Infrastructer.Data;
using System.Net;

var builder = WebApplication.CreateBuilder(args);



// Register application services and infrastructure
builder.Services.AddApplicationServices(); // Ensure this method is defined
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register the HttpClient factory used by CloudinaryController (and any future
// outbound HTTP integrations). AddHttpClient registers IHttpClientFactory plus
// a typed HttpClient, with default 100s timeout and handler lifetime handled.
builder.Services.AddHttpClient();

// CORS — read allowed origins from configuration so prod and dev stay in sync.
// Set Cors:AllowedOrigins in appsettings.json (or via env var Cors__AllowedOrigins__0..N).
// In dev, localhost is allowed; in prod the list MUST be set explicitly or we fail-fast.
var configuredOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();
var isDevelopment = builder.Environment.IsDevelopment();

if (!isDevelopment && configuredOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "Production deployment requires Cors:AllowedOrigins to be set in configuration. " +
        "Set it via appsettings.Production.json or the Cors__AllowedOrigins__0..N env vars.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", policy =>
    {
        if (isDevelopment)
        {
            // Dev only — Vite/React dev server + local IPs.
            policy.SetIsOriginAllowed(origin =>
                origin.StartsWith("http://localhost", StringComparison.OrdinalIgnoreCase) ||
                origin.StartsWith("http://127.0.0.1", StringComparison.OrdinalIgnoreCase))
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            // Prod — strict whitelist.
            policy.WithOrigins(configuredOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

var app = builder.Build();  // Build the app after services have been registered

// Configure middleware pipeline
// Global exception handler to return JSON error responses
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.ContentType = "application/json";
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var ex = exceptionHandlerPathFeature?.Error;
        var status = 500;
        if (ex is UnauthorizedAccessException)
            status = 401;
        else if (ex is NotImplementedException)
            status = 501;
        context.Response.StatusCode = status;
        var result = System.Text.Json.JsonSerializer.Serialize(new { error = ex?.Message });
        await context.Response.WriteAsync(result);
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply CORS policy
app.UseCors("AllowOrigin");

// Authentication and Authorization middleware
app.UseAuthentication();
app.UseAuthorization();

// Apply pending EF migrations + ensure inbox columns exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        if (app.Environment.IsProduction() || db.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
            // Create schema from DbContext model directly (no migrations needed for Production or SQLite)
            await db.Database.EnsureCreatedAsync();
        else
            await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "EF MigrateAsync failed; continuing with inbox schema ensure.");
    }

    try
    {
        await ReactApi.Infrastructer.Data.InboxSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.ResumeSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.AiSchemaEnsurer.EnsureAsync(db, logger);
        await ReactApi.Infrastructer.Data.ResumeSchemaEnsurer.SeedDefaultsAsync(db);
        await ReactApi.Infrastructer.Data.PortfolioDataSeeder.SeedAsync(db);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Database seeding failed; backend will start without database operations.");
    }
}

app.UseStaticFiles();
app.MapControllers();
app.Run();