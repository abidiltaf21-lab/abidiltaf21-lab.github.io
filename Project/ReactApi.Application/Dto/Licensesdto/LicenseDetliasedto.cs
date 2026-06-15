using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Licensesdto
{
    public class LicenseDetliasedto:BaseDomin
    {
        //companyinfor
        public int CompanyId { get; set; }
        public string? CompanyName { get; set; }
        public string? ComericalName { get; set; }
        public required string TIN_ID { get; set; }
        public required string Phone_Number { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public string? Companyissuedate { get; set; }
        //Catagory info
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        //licenes info
        public string? LicenseNumber { get; set; }
        public int Regno { get; set; }
        public string? IssueDate { get; set; }
        public string? ExpiryDate { get; set; }
        public int Fee { get; set; }
        public StatusEnum Status { get; set; }
       
        
    }
}
