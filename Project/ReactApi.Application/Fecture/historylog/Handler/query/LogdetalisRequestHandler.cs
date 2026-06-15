using MediatR;
using ReactApi.Application.Dto.Historylog;
using ReactApi.Application.Fecture.historylog.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.historylog.Handler.query
{
    public class LogdetalisRequestHandler : IRequestHandler<LogdetalisRequest, List<LogDetalisdto>>
    {
        private readonly Iuniteofwork uniteofwork;

        public LogdetalisRequestHandler(Iuniteofwork uniteofwork)
        {
            this.uniteofwork = uniteofwork;
        }
        public async Task<List<LogDetalisdto>> Handle(LogdetalisRequest request, CancellationToken cancellationToken)
        {
            return await  uniteofwork.historylogRepository.LicensesLog(request.licenseId);
        }
    }
}
