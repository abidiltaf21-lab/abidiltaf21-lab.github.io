using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.identityModel;

namespace AfghanWebApplication.data
{
    public static class DatabaseSeeder
    {
        public static void SeedClaimsToRole(ModelBuilder modelBuilder)
        {
            // Create the admin role
            var adminRole = new ApplicationRole
            {
                Id = Guid.NewGuid().ToString(),
                Name = "Admin",
                NormalizedName = "ADMIN",
                
            };
            modelBuilder.Entity<ApplicationRole>().HasData(adminRole);

            // Assign claims to the admin role
            var roleClaims = new List<IdentityRoleClaim<string>>
            {
                new IdentityRoleClaim<string>
                {
                    Id = 1,
                    RoleId = adminRole.Id,
                    ClaimType = "ListUser",
                    ClaimValue = "ListUser"
                },
                new IdentityRoleClaim<string>
                {
                    Id = 2,
                    RoleId = adminRole.Id,
                    ClaimType = "CreateNewUser",
                    ClaimValue = "CreateNewUser"
                },
                new IdentityRoleClaim<string>
                {
                    Id = 3,
                    RoleId = adminRole.Id,
                    ClaimType = "UpdateUser",
                    ClaimValue = "UpdateUser"
                },
                 new IdentityRoleClaim<string>
                {
                    Id = 4,
                    RoleId = adminRole.Id,
                    ClaimType = "UpdatePassword",
                    ClaimValue = "UpdatePassword"
                },
                new IdentityRoleClaim<string>
                {
                    Id = 5,
                    RoleId = adminRole.Id,
                    ClaimType = "AssignRole",
                    ClaimValue = "AssignRole"
                },
                //Roles
                new IdentityRoleClaim<string>
                {
                    Id = 6,
                    RoleId = adminRole.Id,
                    ClaimType = "ListRole",
                    ClaimValue = "ListRole"
                },
                new IdentityRoleClaim<string>
                {
                    Id = 7,
                    RoleId = adminRole.Id,
                    ClaimType = "CreateNewRole",
                    ClaimValue = "CreateNewRole"
                },
                new IdentityRoleClaim<string>
                {
                    Id =8,
                    RoleId = adminRole.Id,
                    ClaimType = "UpdateRole",
                    ClaimValue = "UpdateRole"
                },
              
                new IdentityRoleClaim<string>
                {
                    Id =9,
                    RoleId = adminRole.Id,
                    ClaimType = "AssignPermissions",
                    ClaimValue = "AssignPermissions"
                },
                //Companies
                new IdentityRoleClaim<string>
                {
                    Id =10,
                    RoleId = adminRole.Id,
                    ClaimType = "ListCompanies",
                    ClaimValue = "ListCompanies"
                },
                new IdentityRoleClaim<string>
                {
                    Id = 11,
                    RoleId = adminRole.Id,
                    ClaimType = "CreateCompany",
                    ClaimValue = "CreateCompany"
                },
                new IdentityRoleClaim<string>
                {
                    Id = 12,
                    RoleId = adminRole.Id,
                    ClaimType = "EditCompany",
                    ClaimValue = "EditCompany"
                },
                new IdentityRoleClaim<string>
                {
                    Id = 13,
                    RoleId = adminRole.Id,
                    ClaimType = "SearchCompany",
                    ClaimValue = "SearchCompany"
                },
                 new IdentityRoleClaim<string>
                {
                    Id = 14,
                    RoleId = adminRole.Id,
                    ClaimType = "ViewLicences",
                    ClaimValue = "ViewLicences"
                },

                
                new IdentityRoleClaim<string>
                {
                    Id =15,
                    RoleId = adminRole.Id,
                    ClaimType = "AddLicences",
                    ClaimValue = "AddLicences"
                },

                new IdentityRoleClaim<string>
                {
                    Id =16,
                    RoleId = adminRole.Id,
                    ClaimType = "EditLicences",
                    ClaimValue = "EditLicences"
                },
                new IdentityRoleClaim<string>
                {
                    Id =17,
                    RoleId = adminRole.Id,
                    ClaimType = "Licenceshistory",
                    ClaimValue = "Licenceshistory"
                },
                new IdentityRoleClaim<string>
                {
                    Id =18,
                    RoleId = adminRole.Id,
                    ClaimType = "Viewlicenceshistory",
                    ClaimValue = "Viewlicenceshistory"
                },
                new IdentityRoleClaim<string>
                {
                    Id =19,
                    RoleId = adminRole.Id,
                    ClaimType = "PrintJawaz",
                    ClaimValue ="PrintJawaz"
                },
                  new IdentityRoleClaim<string>
                {
                    Id =20,
                    RoleId = adminRole.Id,
                    ClaimType = "Listcatagories",
                    ClaimValue ="Listcatagories"
                },
                    new IdentityRoleClaim<string>
                {
                    Id =21,
                    RoleId = adminRole.Id,
                    ClaimType = "AddCatagory",
                    ClaimValue ="AddCatagory"
                },
                    new IdentityRoleClaim<string>
                {
                    Id =22,
                    RoleId = adminRole.Id,
                    ClaimType = "EditCatagory",
                    ClaimValue ="EditCatagory"
                },
            };
            modelBuilder.Entity<IdentityRoleClaim<string>>().HasData(roleClaims);

            // Create the admin user
            var adminUser = new ApplicationUser
            {
                Id = Guid.NewGuid().ToString(),
                UserName = "Admin",
                Email = "Admin@gmail.com",
                NormalizedUserName = "ADMIN@GMAIL.COM",
                NormalizedEmail = "ADMIN@GMAIL.COM",
                EmailConfirmed = true,
                PasswordHash = new PasswordHasher<ApplicationUser>().HashPassword(new ApplicationUser(), "Admin@")
            };
            modelBuilder.Entity<ApplicationUser>().HasData(adminUser);

            // Assign the admin role to the admin user
            modelBuilder.Entity<IdentityUserRole<string>>().HasData(new IdentityUserRole<string>
            {
                UserId = adminUser.Id,
                RoleId = adminRole.Id
            });
        }
    }
}