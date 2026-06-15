using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Licensesdto
{
    public class LicensEditdto:BaseDomin
    {
        public int CategoryId { get; set; }
        public int CompanyId { get; set; }
        public string LicenseNumber { get; set; }
        public int Regno { get; set;}
        public string IssueDate { get; set; }
        public string ExpiryDate { get; set; }
    }
}
