using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Identity.User
{
    public class UpdateUsers
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        //public string Password { get; set; }
        //public List<string> Roles { get; set; }
    }
}
