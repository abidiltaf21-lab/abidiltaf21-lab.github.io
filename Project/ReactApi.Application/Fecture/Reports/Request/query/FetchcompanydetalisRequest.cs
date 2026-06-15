using MediatR;
using ReactApi.Application.Dto.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Reports.Request.query
{
    public class FetchcompanydetalisRequest:IRequest<PaginatedResult<CompanyDto>>
    {
    }
}
