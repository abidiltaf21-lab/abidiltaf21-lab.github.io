using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Fecture.Licenes.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Handler.query
{
    public class FetchLicnsesRequestHandler : IRequestHandler<FetchLicnsesRequest, PaginatedResult<Licensesdto>>
    {
        private Iuniteofwork uniteofwrok;

        public FetchLicnsesRequestHandler(Iuniteofwork uniteofwrok)
        {
           this.uniteofwrok= uniteofwrok;
        }
        public async Task<PaginatedResult<Licensesdto>> Handle(FetchLicnsesRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwrok.IlcensesRepository.Fetchlicense(request.PageSize,request.PageNumber);
        }
    }
}
