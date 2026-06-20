// InfrastructureRegistrationServices.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ReactApi.Application.Dto.Identity.Claims;
using ReactApi.Domin.identityModel;
using ReactApi.Infrastructer.Data;
using System.Security.Claims;
using System.Text;

public static class InfrastructureRegistrationServices
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register DbContext with PostgreSQL or SQLite
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data Source=reactapi.db";
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            if (connectionString.Contains("Host=") || connectionString.Contains("Port="))
            {
                options.UseNpgsql(connectionString);
            }
            else
            {
                options.UseSqlite(connectionString);
            }
        });
        // Register Identity services for ApplicationUser and ApplicationRole
        services.AddIdentity<ApplicationUser, ApplicationRole>() // Use ApplicationRole here
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        var jwtKey = configuration["Jwt:Key"];
        if (string.IsNullOrEmpty(jwtKey) || jwtKey.Contains("#{") || jwtKey.Length < 32)
        {
            jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") 
                     ?? Environment.GetEnvironmentVariable("Jwt__Key") 
                     ?? "super_secret_development_key_32_characters_long_for_safety";
        }

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
            };
        });


        services.AddHttpContextAccessor();


        //// Add the RoleClaimsService
        services.AddScoped<RoleClaimsService>();

        //// Custom Claims Principal Factory
        services.AddScoped<IUserClaimsPrincipalFactory<ApplicationUser>, CustomClaimsPrincipalFactory>();
        /// Policy
        services.AddAuthorization(options =>
        {
            // Create New User
            options.AddPolicy("ListUser", policy => policy.RequireClaim("ListUser"));
            options.AddPolicy("CreateNewUser", policy => policy.RequireClaim("CreateNewUser"));
            options.AddPolicy("UpdateUser", policy => policy.RequireClaim("UpdateUser"));
            options.AddPolicy("UpdatePassword", policy => policy.RequireClaim("UpdatePassword"));
            //options.AddPolicy("DeleteUser", policy => policy.RequireClaim("DeleteUser"));
            options.AddPolicy("AssignRole", policy => policy.RequireClaim("AssignRole"));

            // Roles
            options.AddPolicy("ListRole", policy => policy.RequireClaim("ListRole"));
            options.AddPolicy("CreateNewRole", policy => policy.RequireClaim("CreateNewRole"));
            options.AddPolicy("UpdateRole", policy => policy.RequireClaim("UpdateRole"));
            //options.AddPolicy("DeleteRole", policy => policy.RequireClaim("DeleteRole"));
            options.AddPolicy("AssignPermissions", policy => policy.RequireClaim("AssignPermissions"));
        });

        // ── Password Policy (appsettings.json → Security:*) ──────────────────────────────
        var minLength             = configuration.GetValue<int?> ("Security:PasswordMinLength")       ?? 10;
        var requireDigit          = configuration.GetValue<bool?>("Security:RequireDigit")            ?? true;
        var requireUppercase      = configuration.GetValue<bool?>("Security:RequireUppercase")        ?? true;
        var requireLowercase      = configuration.GetValue<bool?>("Security:RequireLowercase")        ?? true;
        var requireNonAlphanumeric= configuration.GetValue<bool?>("Security:RequireNonAlphanumeric")  ?? true;
        var requiredUniqueChars   = configuration.GetValue<int?> ("Security:RequiredUniqueChars")     ?? 4;

        // ── Account Lockout Settings ──────────────────────────────────────────────────────
        var maxFailedAttempts     = configuration.GetValue<int?> ("Security:MaxFailedAccessAttempts") ?? 5;
        var lockoutMinutes        = configuration.GetValue<int?> ("Security:LockoutMinutes")          ?? 15;

        services.Configure<IdentityOptions>(options =>
        {
            // Password rules
            options.Password.RequireNonAlphanumeric = requireNonAlphanumeric;
            options.Password.RequiredLength          = minLength;
            options.Password.RequireDigit            = requireDigit;
            options.Password.RequireUppercase        = requireUppercase;
            options.Password.RequireLowercase        = requireLowercase;
            options.Password.RequiredUniqueChars     = requiredUniqueChars;

            // Account lockout — triggered when lockoutOnFailure:true in SignInManager
            options.Lockout.DefaultLockoutTimeSpan  = TimeSpan.FromMinutes(lockoutMinutes);
            options.Lockout.MaxFailedAccessAttempts = maxFailedAttempts;
            options.Lockout.AllowedForNewUsers      = true;

            // User settings
            options.User.RequireUniqueEmail = true;
        });

        // ── Rate Limiting is registered in Program.cs (needs ASP.NET Core hosting layer) ────
        // See Program.cs → builder.Services.AddRateLimiter(...)

        return services;
    }
}