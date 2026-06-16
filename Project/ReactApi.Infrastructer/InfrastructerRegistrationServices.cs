// InfrastructureRegistrationServices.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using ReactApi.Application.Dto.Identity.Claims;
using ReactApi.Application.Presistance;
using ReactApi.Domin.identityModel;
using ReactApi.Infrastructer.Data;
using ReactApi.Infrastructer.Services;
using System.Security.Claims;
using System.Text;

public static class InfrastructureRegistrationServices
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Register DbContext with PostgreSQL (Railway)
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        services.AddTransient<Iuniteofwork, Uniteofwork>();
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
        ///Policy
        services.AddAuthorization(options =>
        {
            //Create New User
            options.AddPolicy("ListUser", policy => policy.RequireClaim("ListUser"));
            options.AddPolicy("CreateNewUser", policy => policy.RequireClaim("CreateNewUser"));
            options.AddPolicy("UpdateUser", policy => policy.RequireClaim("UpdateUser"));
            options.AddPolicy("UpdatePassword", policy => policy.RequireClaim("UpdatePassword"));
            //options.AddPolicy("DeleteUser", policy => policy.RequireClaim("DeleteUser"));
            options.AddPolicy("AssignRole", policy => policy.RequireClaim("AssignRole"));

            //Roles
            options.AddPolicy("ListRole", policy => policy.RequireClaim("ListRole"));
            options.AddPolicy("CreateNewRole", policy => policy.RequireClaim("CreateNewRole"));
            options.AddPolicy("UpdateRole", policy => policy.RequireClaim("UpdateRole"));
            //options.AddPolicy("DeleteRole", policy => policy.RequireClaim("DeleteRole"));
            options.AddPolicy("AssignPermissions", policy => policy.RequireClaim("AssignPermissions"));
            //Company
            options.AddPolicy("ListCompanies", policy => policy.RequireClaim("ListCompanies"));
            options.AddPolicy("CreateCompany", policy => policy.RequireClaim("CreateCompany"));
            options.AddPolicy("EditCompany", policy => policy.RequireClaim("EditCompany"));
            options.AddPolicy("SearchCompany", policy => policy.RequireClaim("SearchCompany"));
            //Licences
            options.AddPolicy("ViewLicences", policy => policy.RequireClaim("ViewLicences"));
            options.AddPolicy("AddLicences", policy => policy.RequireClaim("AddLicences"));
            options.AddPolicy("EditLicences", policy => policy.RequireClaim("EditLicences"));
            options.AddPolicy("Licenceshistory", policy => policy.RequireClaim("LicencesStatusChange"));
            options.AddPolicy("Viewlicenceshistory", policy => policy.RequireClaim("Viewlicenceshistory"));
            options.AddPolicy("PrintJawaz", policy => policy.RequireClaim("PrintJawaz"));
            //catagory
            options.AddPolicy("Listcatagories", policy => policy.RequireClaim("Listcatagories"));
            options.AddPolicy("AddCatagory", policy => policy.RequireClaim("AddCatagory"));
            options.AddPolicy("EditCatagory", policy => policy.RequireClaim("EditCatagory"));
        });

        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 4;
            options.Password.RequireDigit = false;
            options.Password.RequireUppercase = false;


        });

        return services;
    }
}