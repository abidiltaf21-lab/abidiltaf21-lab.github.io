using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Reports.Request.query
{
    public class FetchLicencesbyStatusRequest:IRequest<PaginatedResult<LicenseDetliasedto>>
    {
        public int Status { get; set; } 
    }
}
