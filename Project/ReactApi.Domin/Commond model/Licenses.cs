using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace ReactApi.Domin.Commond_model
{
    public class Licenses:BaseDomin
    {
        [ForeignKey("Companies")]
        public int CompanyId { get; set; }
        [ForeignKey("LicenseCatagoies")]
        public int CategoryId { get; set; }
        public string LicenseNumber { get; set; }
        public int Regno { get; set; }
        public string IssueDate { get; set; }
        public string ExpiryDate { get; set; }
        public int Status { get; set; }

    }
}
