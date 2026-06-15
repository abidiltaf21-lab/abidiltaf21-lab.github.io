using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Fecture.Company.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Handler.query
{
    public class FetchjawazofcompanyRequestHandler : IRequestHandler<FetchjawazofcompanyRequest, List<LicenseDetliasedto>>
    {
        private Iuniteofwork uniteofwork;

        public FetchjawazofcompanyRequestHandler(Iuniteofwork uniteofwork)
        { 
          this.uniteofwork= uniteofwork;
        }
        public async Task<List<LicenseDetliasedto>> Handle(FetchjawazofcompanyRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwork.CompanyRepository.FetchJawaz(request.CompanyId);
        }
    }
}
