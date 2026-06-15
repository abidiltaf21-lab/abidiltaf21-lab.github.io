using MediatR;
using ReactApi.Application.Dto.LicenseCatagoies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Reports.Request.query
{
    public class CatagoryReportRequest:IRequest<PaginatedResult<LicenseCatagoiesdto>>
    {
    }
}
