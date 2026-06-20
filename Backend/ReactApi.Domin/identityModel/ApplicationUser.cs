using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Domin.identityModel
{
    public class ApplicationUser:IdentityUser
    {
        public string?   OtpCode     { get; set; }
        public DateTime? OtpExpiry   { get; set; }
        /// <summary>Number of failed OTP verification attempts. Resets on success or new OTP generation.</summary>
        public int?      OtpAttempts { get; set; }
    }
}
