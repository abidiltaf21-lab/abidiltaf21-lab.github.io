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

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowOrigin", builder =>
        builder.AllowAnyOrigin()
               .AllowAnyHeader()
               .AllowAnyMethod());
});

var app = builder.Build();  // Build the app after services have been registered

// Configure middleware pipeline
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
        if (app.Environment.IsProduction())
            // Railway/PostgreSQL: create schema from DbContext model directly (no migrations needed)
            await db.Database.EnsureCreatedAsync();
        else
            await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "EF MigrateAsync failed; continuing with inbox schema ensure.");
    }

    await ReactApi.Infrastructer.Data.InboxSchemaEnsurer.EnsureAsync(db, logger);
    await ReactApi.Infrastructer.Data.ResumeSchemaEnsurer.EnsureAsync(db, logger);
    await ReactApi.Infrastructer.Data.ResumeSchemaEnsurer.SeedDefaultsAsync(db);
}

app.UseStaticFiles();
app.MapControllers();
app.Run();