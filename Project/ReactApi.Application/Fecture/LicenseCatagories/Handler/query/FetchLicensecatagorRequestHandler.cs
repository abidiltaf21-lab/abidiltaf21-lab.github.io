using MediatR;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Application.Fecture.LicenseCatagories.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.LicenseCatagories.Handler.query
{
    public class FetchLicensecatagorRequestHandler : IRequestHandler<FetchLicensecatagorRequest, PaginatedResult<LicenseCatagoiesdto>>
    {
        private Iuniteofwork uniteofwork;

        public FetchLicensecatagorRequestHandler(Iuniteofwork uniteofwork) 
        { 
          this.uniteofwork= uniteofwork;
        }  
        public async Task<PaginatedResult<LicenseCatagoiesdto>> Handle(FetchLicensecatagorRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwork.LicenseCatagoriesRepository.GetCatagories(request.PageSize,request.PageNumber);
        }
    }
}