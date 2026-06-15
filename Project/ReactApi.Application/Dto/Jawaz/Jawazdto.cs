using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Jawazdto
{
    public class Jawazdto
    {
        //company information
        public required string Company_Name { get; set; }
        public string English_Name1 { get; set; }
        public required string TIN_ID { get; set; }
        //Catagories information
        public required string Name { get; set; }
        //licences information
        public string? LicenseNumber { get; set; }
        public int Regno { get; set; }
        public string IssueDate { get; set; }
        public string ExpiryDate { get; set; }
        public string company_Adress { get; set; }
        public string Company_estblish_mentyear { get; set; }
    }
}
