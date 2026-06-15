using MediatR;
using ReactApi.Application.Dto.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Request.query
{
    public class SearchingCompanyRequest:IRequest<PaginatedResult<CompanyDto>>
    {
        public string? Company_Name { get; set; }
        public string? English_Name { get; set; }
    }
}
