using MediatR;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Application.Fecture.Reports.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Reports.handler.query
{
    public class CatagoryReportRequestHandler : IRequestHandler<CatagoryReportRequest, PaginatedResult<LicenseCatagoiesdto>>
    {
        private Iuniteofwork uiniteofwork;

        public CatagoryReportRequestHandler(Iuniteofwork uiniteofwork)
        {
          this.uiniteofwork= uiniteofwork;
        }
        public Task<PaginatedResult<LicenseCatagoiesdto>> Handle(CatagoryReportRequest request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }
    }
}
