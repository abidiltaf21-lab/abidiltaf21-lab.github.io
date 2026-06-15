using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ReactApi.Domin.identityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Identity.Claims
{

    public class CustomClaimsPrincipalFactory : UserClaimsPrincipalFactory<ApplicationUser, ApplicationRole>
    {
        private readonly RoleClaimsService _roleClaimsService;

        public CustomClaimsPrincipalFactory(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            RoleClaimsService roleClaimsService, // Inject RoleClaimsService
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)

        {
            _roleClaimsService = roleClaimsService; // Initialize RoleClaimsService
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(ApplicationUser user)
        {
            var identity = await base.GenerateClaimsAsync(user);

            var roles = await UserManager.GetRolesAsync(user);
            foreach (var roleName in roles)
            {
                var role = await RoleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    var roleClaims = await _roleClaimsService.GetRoleClaimsAsync(role); // Use RoleClaimsService
                    foreach (var claim in roleClaims)
                    {
                        identity.AddClaim(claim);
                    }
                }
            }

            return identity;
        }
    }
}

