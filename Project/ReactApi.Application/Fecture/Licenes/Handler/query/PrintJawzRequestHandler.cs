using MediatR;
using ReactApi.Application.Dto.Jawazdto;
using ReactApi.Application.Fecture.Licenes.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Handler.query
{
    public class PrintJawzRequestHandler : IRequestHandler<PrintJawzRequest, List<Jawazdto>>
    {
        private Iuniteofwork uniteofwork;

        public PrintJawzRequestHandler(Iuniteofwork uniteofwork)
        {
            this.uniteofwork= uniteofwork;
        }    
        public async Task<List<Jawazdto>> Handle(PrintJawzRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwork.IlcensesRepository.PrintJawaz(request.licensesid);
        }
    }
}
