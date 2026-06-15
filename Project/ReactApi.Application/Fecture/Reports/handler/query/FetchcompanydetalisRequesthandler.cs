using MediatR;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Fecture.Reports.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Reports.handler.query
{
    public class FetchcompanydetalisRequesthandler : IRequestHandler<FetchcompanydetalisRequest, PaginatedResult<CompanyDto>>
    {
        private Iuniteofwork uniteofwork;

        public FetchcompanydetalisRequesthandler(Iuniteofwork uniteofwork)
        {
          this.uniteofwork= uniteofwork;
        }
        public async Task<PaginatedResult<CompanyDto>> Handle(FetchcompanydetalisRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwork.ReportsRepository.FetchCompanies();
        }
    }
}
