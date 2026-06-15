using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Request.command
{
    public class UpdateLicensRecordRequest:IRequest<LicensEditdto>
    {
        public LicensEditdto LicensEditdto { get; set; }
    }
}
