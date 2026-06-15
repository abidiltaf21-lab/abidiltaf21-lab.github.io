using MediatR;
using ReactApi.Application.Dto.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Request.query
{
    public class GetAllCompaniesQuery:IRequest<PaginatedResult<CompanyDto>>
    {
        public int PageSize { get; set; }   
        public int PageNumber { get; set; }
    }
}
