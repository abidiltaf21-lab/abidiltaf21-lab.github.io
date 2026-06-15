using MediatR;
using ReactApi.Application.Dto.LicenseCatagoies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.LicenseCatagories.Request.Command
{
    public class UpdateLicenseCatagoriesRequest:IRequest<LicenseCatagoiesdto>
    {
        public required LicenseCatagoiesdto LicenseCatagoiesdto { get; set; }
    }
}
