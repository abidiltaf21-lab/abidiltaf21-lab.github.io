using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Fecture.Reports.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Reports.handler.query
{
    public class FetchLicencesbyStatusRequesthandler : IRequestHandler<FetchLicencesbyStatusRequest, PaginatedResult<LicenseDetliasedto>>
    {
        private Iuniteofwork uniteofwork;

        public FetchLicencesbyStatusRequesthandler(Iuniteofwork uniteofwork)
        {
            this.uniteofwork = uniteofwork;
        }

        public async Task<PaginatedResult<LicenseDetliasedto>> Handle(FetchLicencesbyStatusRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwork.ReportsRepository.FetchLicences_by_Status(request.Status);
        }
    }
}
