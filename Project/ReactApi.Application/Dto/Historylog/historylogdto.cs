using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Historylog
{
    public class historylogdto:BaseDomin
    {
        public int licenseId { get; set; }  
        public int currentstate { get; set; }   
        public string Reason { get; set; }  
    }
}
