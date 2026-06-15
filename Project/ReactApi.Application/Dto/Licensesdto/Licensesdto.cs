using ReactApi.Domin.BaseModel;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Licensesdto
{
    public class Licensesdto : BaseDomin
    {

        public int CompanyId { get; set; }
        public int CategoryId { get; set; }
        public string? LicenseNumber { get; set; }
        public int Regno { get; set; }
        public string? IssueDate { get; set; }
        public string? ExpiryDate { get; set; }
        public StatusEnum Status { get; set; }
    }
}
