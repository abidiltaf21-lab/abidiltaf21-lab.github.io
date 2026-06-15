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
    public class SearchCatagoriesRequestHandler : IRequestHandler<SearchCatagoriesRequest, PaginatedResult<LicenseCatagoiesdto>>
    {
        private Iuniteofwork uniteofwork;

        public SearchCatagoriesRequestHandler(Iuniteofwork uniteofwork)
        {

            this.uniteofwork= uniteofwork;    
        }
        public async Task<PaginatedResult<LicenseCatagoiesdto>> Handle(SearchCatagoriesRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwork.LicenseCatagoriesRepository.Searching(request.name);
        }
    }

}
