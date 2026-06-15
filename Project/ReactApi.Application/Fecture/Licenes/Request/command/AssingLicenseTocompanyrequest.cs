using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Request.command
{
    public class AssingLicenseTocompanyrequest:IRequest<Licensesdto>
    {
        public int CompanyId { get; set;}   
        public Licensesdto licensesdto { get; set;}
    }
}
