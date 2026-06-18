using Microsoft.AspNetCore.Identity;
using ReactApi.Domin.identityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Identity.Claims
{
    public class RoleClaimsService
    {
        private readonly RoleManager<ApplicationRole> _roleManager;

        public RoleClaimsService(RoleManager<ApplicationRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<IEnumerable<Claim>> GetRoleClaimsAsync(ApplicationRole role)
        {
            var cliams = await _roleManager.GetClaimsAsync(role);
            return cliams;
        }
    }
}
