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

        // Configure JWT Authentication
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
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    configuration["Jwt:Key"] ?? throw new InvalidOperationException("JWT Key (Jwt:Key) is not configured in appsettings.")))
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

        // Password policy — single source of truth is appsettings.json (Security:*).
        // Falls back to safe defaults (8+ chars, digit, uppercase) if the section is missing.
        var minLength = configuration.GetValue<int?>("Security:PasswordMinLength") ?? 8;
        var requireDigit = configuration.GetValue<bool?>("Security:RequireDigit") ?? true;
        var requireUppercase = configuration.GetValue<bool?>("Security:RequireUppercase") ?? true;
        var requireNonAlphanumeric = configuration.GetValue<bool?>("Security:RequireNonAlphanumeric") ?? true;

        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireNonAlphanumeric = requireNonAlphanumeric;
            options.Password.RequiredLength = minLength;
            options.Password.RequireDigit = requireDigit;
            options.Password.RequireUppercase = requireUppercase;
        });

        return services;
    }
}