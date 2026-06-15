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
    public class EditLicenesRequestHandler : IRequestHandler<EditLicenesRequest, LicensEditdto>
    {
        private Iuniteofwork uniteofwork;

        public EditLicenesRequestHandler(Iuniteofwork uniteofwork) 
        { 
        
            this.uniteofwork= uniteofwork;
        }

        public async Task<LicensEditdto> Handle(EditLicenesRequest request, CancellationToken cancellationToken)
        {
            return await uniteofwork.IlcensesRepository.EditLicens(request.Id);
        }
    }
}
