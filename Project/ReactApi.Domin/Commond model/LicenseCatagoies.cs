using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Domin.Commond_model
{
    public class LicenseCatagoies:BaseDomin
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public int Fee { get; set; }
    }
}
