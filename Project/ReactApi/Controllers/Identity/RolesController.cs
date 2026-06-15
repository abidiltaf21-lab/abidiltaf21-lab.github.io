using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Domin.identityModel;
using ReactApi.Application.Dto.Identity.Role; // Ensure this namespace is correct

namespace ReactApi.Controllers.Identity
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<ApplicationRole> _roleManager;
        public RolesController(RoleManager<ApplicationRole> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
       [Authorize(Policy = "ListRole")]
        public IActionResult GetRoles(int page = 1, int pageSize = 10)
        {
            int skip = (page - 1) * pageSize;
            var totalRoles = _roleManager.Roles.Count();

            var listRoles = _roleManager.Roles
                .Skip(skip)
                .Take(pageSize)
                .ToList();
            var roles = listRoles.Select(role => new
            {
                role.Id,
                role.Name
            }).ToList();
            return Ok(new
            {
                data = roles,
                total = totalRoles
            });
        }
        [HttpPost]
        [Authorize(Policy = "CreateNewRole")]
        public async Task<IActionResult> CreateRoleAsync(RoleModel model)
        {
            var role = new ApplicationRole { Name = model.Name };
            var result = await _roleManager.CreateAsync(role);
            if (result.Succeeded)
            {
                return Ok(result);
            }
            return BadRequest(result.Errors);
        }
        [HttpPut]
        [Authorize(Policy = "UpdateRole")]
        public async Task<IActionResult> UpdateRoleAsync(string roleId, RoleModel model)
        {
            if (model == null || string.IsNullOrEmpty(model.Name))
            {
                return BadRequest("Role name is required.");
            }
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return NotFound();
            }
            role.Name = model.Name;
            var result = await _roleManager.UpdateAsync(role);
            if (result.Succeeded)
            {
                return NoContent(); // Successfully updated
            }
            return BadRequest(result.Errors);
        }
        [HttpDelete]
        //[Authorize(Policy = "DeleteRole")]
        public async Task<IActionResult> DeleteRoleAsync(string roleId)
        {
            var role = await _roleManager.FindByIdAsync(roleId);
            if (role == null)
            {
                return NotFound();
            }
            var result = await _roleManager.DeleteAsync(role);
            if (result.Succeeded)
            {
                return NoContent();
            }
            return BadRequest(result.Errors);
        }
    }
}