using ReactApi.Domin.BaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.LicenseCatagoies
{
    public class LicenseCatagoiesdto:BaseDomin
    {
        public required string Name{ get; set; }
        public string Description{ get; set; }
        public decimal Fee { get; set; }
    }
}
