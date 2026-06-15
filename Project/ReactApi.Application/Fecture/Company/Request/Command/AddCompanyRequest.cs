using MediatR;
using ReactApi.Application.Dto.Company;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Request.Command
{
    public class AddCompanyRequest:IRequest<CompanyDto>
    {
        public required CompanyDto Companydto { get; set; }
    }
}
