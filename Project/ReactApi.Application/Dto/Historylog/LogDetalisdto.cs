using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Historylog
{
    public class LogDetalisdto
    {
        public int licenseId { get; set; }
        public int currentstate { get; set;}
        public int PerviseState { get; set; }
        public string Reason { get; set; }
    }
}
