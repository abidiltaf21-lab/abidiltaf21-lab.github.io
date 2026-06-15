using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Domin.Commond_model
{
    public class Companies:BaseDomin
    {
        public required string Company_Name { get; set; }
        public required string English_Name {  get; set; }
        public  required string TIN_ID { get; set; }
        public  required string Phone_Number {  get; set; }
        public required string Email { get; set; }
        public required string  Address { get; set; }
        public string IssueDate { get; set; }
    }
}
