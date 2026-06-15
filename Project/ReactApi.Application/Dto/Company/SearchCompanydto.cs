using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Dto.Company
{
    public class SearchCompanydto
    {
        public required string Company_Name { get; set; }
        public required string English_Name { get; set; }
    }
}
