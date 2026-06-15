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
    public class CountLicenceRequestHandler : IRequestHandler<CountLicencesRequest,List<LicenseStatusCountDto>>
    {
        private Iuniteofwork uniteofwork;

        public CountLicenceRequestHandler(Iuniteofwork uniteofwork) { this.uniteofwork = uniteofwork; }

        public async Task<List<LicenseStatusCountDto>> Handle(CountLicencesRequest request, CancellationToken cancellationToken)
        {
          var counts=await  uniteofwork.IlcensesRepository.CountLicences();
            return counts;
        }
    }
}
