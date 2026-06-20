using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ReactApi.Application.Dto.Identity.Claims;
using ReactApi.Application.Dto.Identity.User;
using ReactApi.Domin.identityModel;
using ReactApi.Infrastructer.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace AfghanWebApplication.Controllers.UserManageemnt
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser>   _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger<AuthController>        _logger;
        private readonly IConfiguration                 _configuration;
        private readonly RoleManager<ApplicationRole>   _roleManager;
        private readonly RoleClaimsService              _roleClaimsService;
        private readonly ApplicationDbContext           _context;

        public AuthController(
            UserManager<ApplicationUser>   userManager,
            SignInManager<ApplicationUser> signInManager,
            ILogger<AuthController>        logger,
            IConfiguration                 configuration,
            RoleManager<ApplicationRole>   roleManager,
            RoleClaimsService              roleClaimsService,
            ApplicationDbContext           context)
        {
            _userManager       = userManager;
            _signInManager     = signInManager;
            _logger            = logger;
            _configuration     = configuration;
            _roleManager       = roleManager;
            _roleClaimsService = roleClaimsService;
            _context           = context;
        }

        // ── GET /api/auth — list users ─────────────────────────────────────────────────
        [HttpGet]
        [Authorize(policy: "ListUser")]
        public async Task<IActionResult> GetUsers(int page = 1, int pageSize = 10)
        {
            int skip       = (page - 1) * pageSize;
            var totalUsers = await _userManager.Users.CountAsync();

            var listUsers = await _userManager.Users
                .Skip(skip).Take(pageSize).ToListAsync();

            var usersWithRoles = new List<object>();
            foreach (var user in listUsers)
            {
                var roles = await _userManager.GetRolesAsync(user);
                usersWithRoles.Add(new { user.Id, user.UserName, user.Email, Roles = roles });
            }

            return Ok(new { data = usersWithRoles, total = totalUsers });
        }

        // ── GET /api/auth/Search ───────────────────────────────────────────────────────
        [HttpGet("Search")]
        [Authorize]
        public async Task<IActionResult> SearchUser(string? userName, string? email)
        {
            var usersQuery = _userManager.Users.AsQueryable();

            if (!string.IsNullOrEmpty(userName))
                usersQuery = usersQuery.Where(u => u.UserName != null && u.UserName.Contains(userName));
            if (!string.IsNullOrEmpty(email))
                usersQuery = usersQuery.Where(u => u.Email != null && u.Email.Contains(email));

            var users    = await usersQuery.ToListAsync();
            var userList = new List<object>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new { Id = user.Id, UserName = user.UserName, Email = user.Email, Roles = roles });
            }

            return Ok(new { Users = userList });
        }

        // ── POST /api/auth/PostUser ────────────────────────────────────────────────────
        [HttpPost("PostUser")]
        [Authorize(Policy = "CreateNewUser")]
        public async Task<IActionResult> PostUser(AddNewUser users)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var newUser = new ApplicationUser
            {
                UserName = users.UserName,
                Email    = users.Email,
            };

            var result = await _userManager.CreateAsync(newUser, users.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = "User creation failed.", errors = result.Errors.Select(e => e.Description) });

            foreach (var roleName in users.Roles)
            {
                var myRole = await _roleManager.FindByIdAsync(roleName);
                if (myRole?.Name == null)
                    return BadRequest(new { message = $"Role not found: {roleName}" });
                await _userManager.AddToRoleAsync(newUser, myRole.Name);
            }

            return Ok(new { message = "User created successfully and roles assigned." });
        }

        // ── PUT /api/auth ─────────────────────────────────────────────────────────────
        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdateRegisterUsers(string id, UpdateUsers dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            user.UserName = dto.UserName;
            user.Email    = dto.Email;
            var result    = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
                return BadRequest(new { message = "User update failed.", errors = result.Errors });

            return Ok(dto);
        }

        // ── PUT /api/auth/UpdateRegisterUserPassword ───────────────────────────────────
        [HttpPut("UpdateRegisterUserPassword")]
        [Authorize]
        public async Task<IActionResult> UpdateRegisterUserPassword(string id, UpdateUserPasswroddto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(dto.Password))
            {
                var resetToken  = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetResult = await _userManager.ResetPasswordAsync(user, resetToken, dto.Password);
                if (!resetResult.Succeeded)
                    return BadRequest(new { message = "Password reset failed.", errors = resetResult.Errors });
            }
            return Ok();
        }

        // ── POST /api/auth/change-roles ────────────────────────────────────────────────
        [HttpPost("change-roles")]
        [Authorize(Policy = "AssignRole")]
        public async Task<IActionResult> ChangeRoles(List<string> RoleIds, string UserId)
        {
            if (string.IsNullOrEmpty(UserId) || RoleIds == null || !RoleIds.Any())
                return BadRequest(new { success = false, message = "Invalid Role(s) or User" });

            var user = await _userManager.FindByIdAsync(UserId);
            if (user == null) return NotFound(new { success = false, message = "User Not Found" });

            var userRoles = await _userManager.GetRolesAsync(user);
            if (userRoles.Any())
            {
                var removeResult = await _userManager.RemoveFromRolesAsync(user, userRoles);
                if (!removeResult.Succeeded)
                    return BadRequest(new { success = false, message = "Failed to remove existing roles" });
            }

            foreach (var roleId in RoleIds)
            {
                var role = await _roleManager.FindByIdAsync(roleId);
                if (role?.Name == null)
                    return BadRequest(new { success = false, message = $"Role {roleId} not found" });

                var addResult = await _userManager.AddToRoleAsync(user, role.Name);
                if (!addResult.Succeeded)
                    return BadRequest(new { success = false, message = $"Failed to assign role {role.Name}" });
            }

            return Ok(new { success = true, message = "Roles changed successfully" });
        }

        // ── DELETE /api/auth ───────────────────────────────────────────────────────────
        [HttpDelete]
        [Authorize(Policy = "DeleteUser")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded) return BadRequest(result.Errors);

            return Ok(id);
        }

        // ── POST /api/auth/Logout ──────────────────────────────────────────────────────
        [HttpPost("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        // ── POST /api/auth/login ───────────────────────────────────────────────────────
        [HttpPost("login")]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> Login(LoginUser loginDto)
        {
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null)
                {
                    // Generic message — do NOT reveal whether email exists
                    _logger.LogWarning("[AUTH] Login failed for {Email} from {IP}: email not found.", loginDto.Email, ip);
                    return BadRequest(new { message = "Invalid email or password." });
                }

                // Check if account is locked out BEFORE trying password
                if (await _userManager.IsLockedOutAsync(user))
                {
                    var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);
                    var remaining  = lockoutEnd.HasValue
                        ? (int)Math.Ceiling((lockoutEnd.Value - DateTimeOffset.UtcNow).TotalMinutes)
                        : 15;
                    _logger.LogWarning("[AUTH] Locked-out account login attempt for {Email} from {IP}.", loginDto.Email, ip);
                    return BadRequest(new
                    {
                        message          = $"Account is temporarily locked. Try again in {remaining} minute(s).",
                        isLockedOut      = true,
                        retryAfterMinutes= remaining
                    });
                }

                // lockoutOnFailure: true — every wrong password increments the counter
                var result = await _signInManager.PasswordSignInAsync(
                    user, loginDto.Password, isPersistent: false, lockoutOnFailure: true);

                if (result.Succeeded)
                {
                    // Reset the access-failed counter on success
                    await _userManager.ResetAccessFailedCountAsync(user);
                    _logger.LogInformation("[AUTH] Successful login for {Email} from {IP}.", loginDto.Email, ip);
                    var token = await GenerateToken(user);
                    return Ok(new { user, token });
                }

                if (result.IsLockedOut)
                {
                    var lockoutEnd = await _userManager.GetLockoutEndDateAsync(user);
                    var remaining  = lockoutEnd.HasValue
                        ? (int)Math.Ceiling((lockoutEnd.Value - DateTimeOffset.UtcNow).TotalMinutes)
                        : 15;
                    _logger.LogWarning("[AUTH] Account locked after failed attempts for {Email} from {IP}.", loginDto.Email, ip);
                    return BadRequest(new
                    {
                        message          = $"Too many failed attempts. Account locked for {remaining} minute(s).",
                        isLockedOut      = true,
                        retryAfterMinutes= remaining
                    });
                }

                var failedCount = await _userManager.GetAccessFailedCountAsync(user);
                var maxAttempts = _configuration.GetValue<int>("Security:MaxFailedAccessAttempts", 5);
                var remaining2  = maxAttempts - failedCount;

                _logger.LogWarning("[AUTH] Wrong password for {Email} from {IP}. Attempts left: {Left}.", loginDto.Email, ip, remaining2);
                return BadRequest(new
                {
                    message          = remaining2 > 0
                        ? $"Invalid email or password. {remaining2} attempt(s) remaining before lockout."
                        : "Account will be locked on the next failed attempt.",
                    attemptsRemaining= remaining2
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[AUTH] Unexpected error during login for {Email} from {IP}.", loginDto.Email, ip);
                return StatusCode(500, new { message = ex.ToString() });
            }
        }

        // ── POST /api/auth/forgot-password ────────────────────────────────────────────
        [HttpPost("forgot-password")]
        [AllowAnonymous]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _userManager.FindByEmailAsync(dto.Email);
                // Always return the same generic response to avoid email enumeration
                if (user == null)
                {
                    _logger.LogWarning("[OTP] ForgotPassword for unknown email: {Email}", dto.Email);
                    return Ok(new { message = "If that email exists, an OTP has been sent." });
                }

                // ── Crypto-safe 6-digit OTP ───────────────────────────────────────────
                var otp = GenerateCryptoOtp();

                var otpExpiry = _configuration.GetValue<int>("Security:OtpExpiryMinutes", 10);
                user.OtpCode        = otp;
                user.OtpExpiry      = DateTime.UtcNow.AddMinutes(otpExpiry);
                user.OtpAttempts    = 0;   // reset attempt counter

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    _logger.LogError("[OTP] Failed to store OTP for {Email}.", user.Email);
                    return StatusCode(500, new { message = "OTP generation failed." });
                }

                // Log OTP only in development / when explicitly enabled
                if (_configuration.GetValue<bool>("Security:ExposeOtpInResponse", false))
                    _logger.LogWarning("[OTP DEBUG] OTP for {Email}: {Otp}", user.Email, otp);

                // Send email
                bool emailSent = false;
                try
                {
                    emailSent = await SendOtpEmailAsync(user.Email!, otp, otpExpiry);
                }
                catch (Exception mailEx)
                {
                    _logger.LogWarning(mailEx, "[OTP] Email delivery failed for {Email}.", user.Email);
                }

                return Ok(new
                {
                    message  = "If that email exists, an OTP has been sent.",
                    emailSent,
                    // Only expose OTP in response when flag is explicitly true (dev debugging)
                    debugCode = _configuration.GetValue<bool>("Security:ExposeOtpInResponse", false) ? otp : null
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[OTP] Unexpected error in ForgotPassword.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        // ── POST /api/auth/reset-password-otp ─────────────────────────────────────────
        [HttpPost("reset-password-otp")]
        [AllowAnonymous]
        [EnableRateLimiting("auth")]
        public async Task<IActionResult> ResetPasswordOtp([FromBody] ResetPasswordOtpDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var user = await _userManager.FindByEmailAsync(dto.Email);
                if (user == null)
                    return BadRequest(new { message = "Invalid request." });

                // ── OTP attempt limit ─────────────────────────────────────────────────
                var maxOtpAttempts = _configuration.GetValue<int>("Security:OtpMaxAttempts", 3);
                if (user.OtpAttempts >= maxOtpAttempts)
                {
                    // Invalidate OTP so it can't be brute-forced even after cooldown
                    user.OtpCode   = null;
                    user.OtpExpiry = null;
                    await _userManager.UpdateAsync(user);
                    return BadRequest(new
                    {
                        message = "Too many incorrect OTP attempts. Please request a new OTP.",
                        otpExpired = true
                    });
                }

                // ── Expiry check ──────────────────────────────────────────────────────
                if (!user.OtpExpiry.HasValue || user.OtpExpiry.Value < DateTime.UtcNow)
                    return BadRequest(new { message = "OTP code has expired. Please request a new one.", otpExpired = true });

                // ── Constant-time comparison to prevent timing attacks ─────────────────
                if (string.IsNullOrEmpty(user.OtpCode) || !CryptographicEquals(user.OtpCode, dto.Otp))
                {
                    user.OtpAttempts = (user.OtpAttempts ?? 0) + 1;
                    await _userManager.UpdateAsync(user);

                    var attemptsLeft = maxOtpAttempts - user.OtpAttempts;
                    return BadRequest(new
                    {
                        message       = attemptsLeft > 0
                            ? $"Invalid OTP. {attemptsLeft} attempt(s) remaining."
                            : "Invalid OTP. OTP has been invalidated — please request a new one.",
                        attemptsLeft
                    });
                }

                // ── OTP valid — reset password ────────────────────────────────────────
                var resetToken  = await _userManager.GeneratePasswordResetTokenAsync(user);
                var resetResult = await _userManager.ResetPasswordAsync(user, resetToken, dto.NewPassword);

                if (!resetResult.Succeeded)
                {
                    var errors = string.Join(", ", resetResult.Errors.Select(e => e.Description));
                    return BadRequest(new { message = $"Password reset failed: {errors}" });
                }

                // Clear OTP + reset lockout
                user.OtpCode     = null;
                user.OtpExpiry   = null;
                user.OtpAttempts = 0;
                await _userManager.UpdateAsync(user);
                await _userManager.ResetAccessFailedCountAsync(user);

                _logger.LogInformation("[AUTH] Password successfully reset for {Email}.", user.Email);
                return Ok(new { message = "Password reset successfully. You can now log in." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[AUTH] Unexpected error in ResetPasswordOtp.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        // ── GET /api/auth/verify ───────────────────────────────────────────────────────
        [HttpGet("verify")]
        [Authorize]
        public async Task<IActionResult> VerifyToken()
        {
            try
            {
                var userId = User.FindFirst("UserId")?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized(new { message = "User ID not found in token." });

                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                    return NotFound(new { message = "User not found." });

                var roles  = await _userManager.GetRolesAsync(user);
                var claims = await _userManager.GetClaimsAsync(user);

                var roleClaims = new List<System.Security.Claims.Claim>();
                foreach (var role in roles)
                {
                    var roleEntity = await _roleManager.FindByNameAsync(role);
                    if (roleEntity != null)
                        roleClaims.AddRange(await _roleClaimsService.GetRoleClaimsAsync(roleEntity));
                }

                var allClaims = claims.Concat(roleClaims).Select(c => new { c.Type, c.Value }).ToList();

                return Ok(new
                {
                    user.UserName, user.Email, user.Id,
                    roles, claims = allClaims
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "[AUTH] Token verification error.");
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        // ── GET /api/auth/Countuser ────────────────────────────────────────────────────
        [HttpGet("Countuser")]
        public IActionResult CountUser()
        {
            return Ok(_userManager.Users.Count());
        }

        // ══════════════════════════════════════════════════════════════════════════════════
        // PRIVATE HELPERS
        // ══════════════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Generates a cryptographically secure 6-digit OTP using RandomNumberGenerator.
        /// Unlike System.Random, this is not predictable from a seed.
        /// </summary>
        private static string GenerateCryptoOtp()
        {
            // Get 4 random bytes → uint → modulo to stay in [100000, 999999]
            Span<byte> buf = stackalloc byte[4];
            RandomNumberGenerator.Fill(buf);
            var value = (BitConverter.ToUInt32(buf) % 900000) + 100000;
            return value.ToString();
        }

        /// <summary>
        /// Constant-time string comparison to prevent timing-based OTP brute-force.
        /// </summary>
        private static bool CryptographicEquals(string a, string b)
        {
            if (a.Length != b.Length) return false;
            var result = 0;
            for (int i = 0; i < a.Length; i++)
                result |= a[i] ^ b[i];
            return result == 0;
        }

        /// <summary>
        /// Sends an OTP email with a branded HTML template.
        /// Returns true if email was sent successfully.
        /// </summary>
        private async Task<bool> SendOtpEmailAsync(string toEmail, string otp, int expiryMinutes)
        {
            var smtpHost    = _configuration["Smtp:Host"];
            var smtpPortStr = _configuration["Smtp:Port"];
            var smtpUser    = _configuration["Smtp:Username"];
            var smtpPass    = _configuration["Smtp:Password"];
            var fromEmail   = _configuration["Smtp:FromEmail"] ?? "no-reply@smooothpixel.com";

            if (string.IsNullOrEmpty(smtpHost) || !int.TryParse(smtpPortStr, out int smtpPort))
                return false;

            var html = $@"
<!DOCTYPE html>
<html>
<head><meta charset='utf-8'></head>
<body style='font-family:Plus Jakarta Sans,sans-serif;background:#f1f5f9;padding:32px;'>
  <div style='max-width:480px;margin:0 auto;background:#fff;border-radius:20px;
              box-shadow:0 8px 32px rgba(15,23,42,0.08);overflow:hidden;'>
    <div style='background:linear-gradient(135deg,#ffae00,#f54200);padding:28px 32px;text-align:center;'>
      <h1 style='color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.02em;'>
        SmooothPixel Studio
      </h1>
      <p style='color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;'>Password Reset OTP</p>
    </div>
    <div style='padding:32px;text-align:center;'>
      <p style='color:#475569;font-size:14px;margin:0 0 24px;'>
        Use the one-time code below to reset your password.
        This code expires in <strong>{expiryMinutes} minutes</strong>.
      </p>
      <div style='display:inline-block;background:#f8fafc;border:2px solid rgba(255,174,0,0.3);
                  border-radius:16px;padding:20px 40px;margin-bottom:24px;'>
        <span style='font-size:36px;font-weight:800;letter-spacing:0.18em;
                     background:linear-gradient(135deg,#ffae00,#f54200);
                     -webkit-background-clip:text;-webkit-text-fill-color:transparent;'>
          {otp}
        </span>
      </div>
      <p style='color:#94a3b8;font-size:12px;margin:0;'>
        If you didn't request this, please ignore this email. Your account is safe.
      </p>
    </div>
    <div style='background:#f8fafc;padding:16px 32px;text-align:center;'>
      <p style='color:#94a3b8;font-size:11px;margin:0;'>
        © {DateTime.UtcNow.Year} SmooothPixel Studio · This is an automated message.
      </p>
    </div>
  </div>
</body>
</html>";

            using var mail = new System.Net.Mail.MailMessage();
            mail.From      = new System.Net.Mail.MailAddress(fromEmail, "SmooothPixel Studio");
            mail.To.Add(toEmail);
            mail.Subject   = "Your Password Reset OTP Code";
            mail.Body      = html;
            mail.IsBodyHtml = true;

            using var smtp = new System.Net.Mail.SmtpClient(smtpHost, smtpPort);
            if (!string.IsNullOrEmpty(smtpUser))
                smtp.Credentials = new System.Net.NetworkCredential(smtpUser, smtpPass);
            smtp.EnableSsl = _configuration.GetValue<bool>("Smtp:EnableSsl", true);

            await smtp.SendMailAsync(mail);
            _logger.LogInformation("[OTP] Email sent to {Email}.", toEmail);
            return true;
        }

        /// <summary>
        /// Generates a signed JWT for the given user.
        /// Token lifetime comes from appsettings Jwt:AccessTokenExpirationMinutes (default 15 min).
        /// </summary>
        private async Task<string> GenerateToken(ApplicationUser user)
        {
            var claims = new List<System.Security.Claims.Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Email ?? user.UserName ?? "Unknown"),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(JwtRegisteredClaimNames.Iat,
                    DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64),
                new("UserId", user.Id.ToString()),
                new("Email",  user.Email ?? "Unknown")
            };

            var userClaims = await _userManager.GetClaimsAsync(user);
            claims.AddRange(userClaims);

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                var roleEntity = await _roleManager.FindByNameAsync(role);
                if (roleEntity != null)
                    claims.AddRange(await _roleClaimsService.GetRoleClaimsAsync(roleEntity));
            }

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey) || jwtKey.Contains("#{") || jwtKey.Length < 32)
            {
                jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") 
                         ?? Environment.GetEnvironmentVariable("Jwt__Key") 
                         ?? "super_secret_development_key_32_characters_long_for_safety";
            }

            var key     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var signIn  = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expMins = _configuration.GetValue<int>("Jwt:AccessTokenExpirationMinutes", 15);

            var token = new JwtSecurityToken(
                issuer            : _configuration["Jwt:Issuer"],
                audience          : _configuration["Jwt:Audience"],
                claims            : claims,
                notBefore         : DateTime.UtcNow,
                expires           : DateTime.UtcNow.AddMinutes(expMins),
                signingCredentials: signIn);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}