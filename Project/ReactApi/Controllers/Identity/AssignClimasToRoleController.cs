using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Domin.identityModel;
using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using ReactApi.Application.Dto.Identity.Role;
using ReactApi.Application.Dto.Identity.Claims;

namespace ReactApi.Controllers.Identity
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignClimasToRoleController : ControllerBase
    {
        private readonly RoleManager<ApplicationRole> roleManager;

        public AssignClimasToRoleController(RoleManager<ApplicationRole> roleManager)
        {
            this.roleManager = roleManager;
        }

      
        [HttpGet("{RoleId}")]
        [Authorize(Policy = "AssignPermissions")]
        public async Task<IActionResult> GetRoleClaimsAsync(string RoleId)
        {
            var role = await roleManager.FindByIdAsync(RoleId);
            if (role == null)
            {
                return NotFound();
            }

            var existingUserClaims = await roleManager.GetClaimsAsync(role);
            var model = new RoleViewModel
            {
                RoleId = role.Id
            };

            foreach (Claim claim in ClaimsStore.AllClaims) // Assuming ClaimsStore.AllClaims holds predefined claims
            {
                var userClaims = new RoleCliams
                {
                    ClaimType = claim.Type
                };
                if (existingUserClaims.Any(c => c.Type == claim.Type))
                {
                    userClaims.IsSelected = true;
                }
                model.Claims.Add(userClaims);
            }

            return Ok(model);
        }

        [HttpPost]
       [Authorize(Policy = "AssignPermissions")]
        public async Task<IActionResult> UpdateRoleClaimsAsync([FromBody] RoleViewModel roleViewModel)
        {
            // Fetch the role using RoleManager by RoleId
            var role = await roleManager.FindByIdAsync(roleViewModel.RoleId);
            if (role == null)
            {
                return NotFound(new { message = "Role not found." });
            }

            // Get existing claims associated with this role
            var existingClaims = await roleManager.GetClaimsAsync(role);

            // Remove existing claims from the role (looping through individual claims)
            foreach (var claim in existingClaims)
            {
                var result = await roleManager.RemoveClaimAsync(role, claim);
                if (!result.Succeeded)
                {
                    return StatusCode(500, new { message = "Failed to remove existing claims." });
                }
            }
            // Add new claims selected by the user
            var claimsToAdd = roleViewModel.Claims
                .Where(c => c.IsSelected) // Only the selected claims
                .Select(c => new Claim(c.ClaimType, c.ClaimType)) // Adjust the ClaimValue if needed
                .ToList();

            // Add each selected claim individually
            foreach (var claim in claimsToAdd)
            {
                var addResult = await roleManager.AddClaimAsync(role, claim); // Add one claim at a time
                if (!addResult.Succeeded)
                {
                    return StatusCode(500, new { message = "Failed to add selected claims." });
                }
            }

            return NoContent(); // Successfully updated role claims
        }



    }
}

