using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Domin
{
    public class HistoryLicenesLogTable:BaseDomin
    {
        [ForeignKey("Licenses")]
        public int LicensesId { get; set; }
        public int PerviseState { get; set;}
        public int CurrentStatus { get; set;}
        public string Reason { get; set;}
        }
}
