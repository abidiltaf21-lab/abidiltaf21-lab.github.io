using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Jawazdto
{
    public class CompanyReport
    {
        public required string Company_Name { get; set; }
        public required string TIN_ID { get; set; }
        public required string Phone_Number { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public string IssueDate { get; set; }
        //catagory
        public string CatagoryType { get; set; }
        public int Fee { get; set; }
        //licenes information
        public string LicenseNumber { get; set; }
        public int Regno { get; set; }
        public StatusEnum Status { get; set; }
    }
}
