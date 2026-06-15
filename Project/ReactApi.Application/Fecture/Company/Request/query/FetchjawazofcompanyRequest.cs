using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Request.query
{
    public class FetchjawazofcompanyRequest:IRequest<List<LicenseDetliasedto>>
    {
        public int CompanyId {  get; set; }
    }
}
