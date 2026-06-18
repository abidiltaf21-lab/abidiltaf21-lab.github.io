using ReactApi.Application.Dto.Identity.Claims;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Identity.Role
{
    public class RoleViewModel
    {
        public RoleViewModel()
        {
            Claims = new List<RoleCliams>();
        }

        public string? RoleId { get; set; }
        public List<RoleCliams> Claims { get; set; }
    }
}
