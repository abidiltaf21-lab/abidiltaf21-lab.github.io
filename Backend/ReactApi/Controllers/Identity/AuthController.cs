using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactApi.Application.Dto.Identity.Claims;
using ReactApi.Application.Dto.Identity.User;
using ReactApi.Domin.identityModel;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace AfghanWebApplication.Controllers.UserManageemnt
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<AuthController> _logger;
        private readonly IConfiguration _configuration;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly RoleClaimsService _roleClaimsService;
        public AuthController(UserManager<ApplicationUser> userManager,
                                     SignInManager<ApplicationUser> signInManager, ILogger<AuthController> logger,
                                     IConfiguration configuration,
                                     RoleManager<ApplicationRole> roleManager,
                                     RoleClaimsService roleClaimsService
                                     )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _configuration = configuration;
            _roleManager = roleManager;
            _roleClaimsService = roleClaimsService;
        }
        [HttpGet]
        [Authorize(policy: "ListUser")]
        public async Task<IActionResult> GetUsers(int page = 1, int pageSize = 10)
        {
            int skip = (page - 1) * pageSize;
            var totalUsers = await _userManager.Users.CountAsync();

            var listUsers = await _userManager.Users
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            var usersWithRoles = new List<object>();
            foreach (var user in listUsers)
            {
                var roles = await _userManager.GetRolesAsync(user);
                usersWithRoles.Add(new
                {
                    user.Id,
                    user.UserName,
                    user.Email,
                    Roles = roles
                });
            }

            return Ok(new
            {
                data = usersWithRoles,
                total = totalUsers
            });
        }
        [HttpGet("Search")]
        public async Task<IActionResult> SearchUser(string? userName, string? email)
        {
            var usersQuery = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(userName))
            {
                usersQuery = usersQuery.Where(u => u.UserName != null && u.UserName.Contains(userName));
            }
            if (!string.IsNullOrEmpty(email))
            {
                usersQuery = usersQuery.Where(u => u.Email != null && u.Email.Contains(email));
            }

            var users = await usersQuery.ToListAsync();

            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user); // Fetch roles for each user

                userList.Add(new
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Roles = roles // Send roles in response
                });
            }

            return Ok(new { Users = userList });
        }


        [HttpPost("PostUser")]
        [Authorize(Policy = "CreateNewUser")]
        public async Task<IActionResult> PostUser(AddNewUser users)
        {
            if (ModelState.IsValid)
            {
                var newUser = new ApplicationUser
                {
                    UserName = users.UserName,
                    Email = users.Email,
                };

                var result = await _userManager.CreateAsync(newUser, users.Password);

                if (result.Succeeded)
                {
                    foreach (var roleName in users.Roles)
                    {
                        var myRole = await _roleManager.FindByIdAsync(roleName);

                        if (myRole != null && myRole.Name != null)
                        {
                            var addRole = await _userManager.AddToRoleAsync(newUser, myRole.Name);
                        }
                        else
                        {
                            return Ok("Role Not Found");
                        }
                    }
                    return Ok(new { message = "User created successfully and roles assigned." });
                }
                else
                {
                    return Ok("message");
                }
            }
            return Ok(users);
        }
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateRegisterUsers(string id, UpdateUsers dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            user.UserName = dto.UserName;
            user.Email = dto.Email;

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return BadRequest(new { message = "User update failed.", errors = result.Errors });
            }

            return Ok(dto);
        }

        [HttpPut("UpdateRegisterUserPassword")]
        [Authorize]
        public async Task<IActionResult> UpdateRegisterUserPassword(string id, UpdateUserPasswroddto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetResult = await _userManager.ResetPasswordAsync(user, resetToken, dto.Password);
                if (!resetResult.Succeeded)
                {
                    return Ok(new { message = "Password reset failed.", errors = resetResult.Errors });
                }
            }
            return Ok();
        }
        [HttpPost("change-roles")]
        [Authorize(Policy = "AssignRole")]
        public async Task<IActionResult> ChangeRoles(List<string> RoleIds, string UserId)
        {
            if (string.IsNullOrEmpty(UserId) || RoleIds == null || !RoleIds.Any())
            {
                return Ok(new { success = false, message = "Invalid Role(s) or User" });
            }

            var user = await _userManager.FindByIdAsync(UserId);
            if (user == null)
            {
                return Ok(new { success = false, message = "User Not Found" });
            }

            // Get the current roles of the user
            var userRoles = await _userManager.GetRolesAsync(user);

            // Remove all current roles before assigning new ones
            if (userRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, userRoles);
                if (!removeResult.Succeeded)
                {
                    return Ok(new { success = false, message = "Failed to remove existing roles" });
                }
            }

            // Assign new roles to the user
            foreach (var roleId in RoleIds)
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                if (role == null || role.Name == null)
                {
                    return Ok(new { success = false, message = $"Role with ID {roleId} Not Found or invalid" });
                }

                var addResult = await _userManager.AddToRoleAsync(user, role.Name);
                if (!addResult.Succeeded)
                {
                    return Ok(new { success = false, message = $"Failed to assign role {role.Name}" });
                }
            }
            return Ok(new { success = true, message = "Roles changed successfully" });
        }

        [HttpDelete]
        [Authorize(Policy = "DeleteUser")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(id);
        }
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginUser loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors);
                    foreach (var error in errors)
                    {
                        _logger.LogWarning($"Validation error: {error.ErrorMessage}");
                    }
                    return BadRequest(ModelState);
                }

                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    _logger.LogWarning($"Login failed for {loginDto.Email}: user not found.");
                    return BadRequest("Invalid login attempt.");
                }

                var result = await _signInManager.PasswordSignInAsync(user, loginDto.Password, false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var token = await GenerateToken(user);
                    return Ok(new { user, token = token });
                }
                else
                {
                    _logger.LogWarning($"Login failed for {loginDto.Email}: incorrect password.");
                    return BadRequest("Invalid login attempt.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred during login: {ex}");
                return StatusCode(500, "Internal server error.");
            }
        }
        private async Task<string> GenerateToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email ?? user.UserName ?? "Unknown"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("UserId", user.Id.ToString()),
                new Claim("Email", user.Email ?? "Unknown")
            };

            // Add user-specific claims
            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);

            // Add role-specific claims
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                // Fetch the role entity using the role name (string)
                var roleEntity = await _roleManager.FindByNameAsync(role);
                if (roleEntity != null)
                {
                    // Get role-specific claims from the role entity
                    var roleClaims = await _roleClaimsService.GetRoleClaimsAsync(roleEntity);
                    foreach (var roleClaim in roleClaims)
                    {
                        claims.Add(roleClaim);  // Add role-specific claims to the token
                    }
                }
            }

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("JWT Key is not configured.");
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: signIn
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("verify")]
        [Authorize]
        public async Task<IActionResult> VerifyToken()
        {
            try
            {
                var userId = User.FindFirst("UserId")?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized("User ID not found in token.");
                }

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                // Get user's roles
                var roles = await _userManager.GetRolesAsync(user);

                // Get user's claims
                var claims = await _userManager.GetClaimsAsync(user);

                // Get the role-specific claims
                var roleClaims = new List<Claim>();
                foreach (var role in roles)
                {
                    var roleEntity = await _roleManager.FindByNameAsync(role);
                    if (roleEntity != null)
                    {
                        var roleSpecificClaims = await _roleClaimsService.GetRoleClaimsAsync(roleEntity);
                        roleClaims.AddRange(roleSpecificClaims);
                    }
                }

                // Merge user claims and role claims
                var allClaims = claims.Concat(roleClaims).Select(c => new { c.Type, c.Value }).ToList();

                return Ok(new
                {
                    user.UserName,
                    user.Email,
                    user.Id,
                    roles,
                    claims = allClaims
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"An error occurred during token verification: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }
        }

        [HttpGet("Countuser")]
        public IActionResult CountUser()
        {
            var count = _userManager.Users.Count();
            return Ok(count);
        }


    }
}