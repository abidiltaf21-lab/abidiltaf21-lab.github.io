using MediatR;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Fecture.Company.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Handler.query
{
    public class SearchingCompanyRequestHandler : IRequestHandler<SearchingCompanyRequest, PaginatedResult<CompanyDto>>
    {
        private Iuniteofwork uniteofwork;

        public SearchingCompanyRequestHandler(Iuniteofwork uniteofwork)
        { 
          this.uniteofwork= uniteofwork;


        }
        public async Task<PaginatedResult<CompanyDto>> Handle(SearchingCompanyRequest request, CancellationToken cancellationToken)
        {
           return await  uniteofwork.CompanyRepository.SearchCompany(request.Company_Name,request.English_Name);
        }
    }
}
