using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Identity.User
{
    public class AddNewUser
    {
        public required string UserName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string ConfirmedPassword { get; set; }
        //Roles
        public List<string> Roles { get; set; } = new List<string>();
    }
}
