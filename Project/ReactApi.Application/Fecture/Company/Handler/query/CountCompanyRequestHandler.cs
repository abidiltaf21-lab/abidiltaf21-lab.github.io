using MediatR;
using ReactApi.Application.Fecture.Company.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Handler.query
{
    public class CountCompanyRequestHandler : IRequestHandler<GetCompanyCountQuery, int>
    {
        private Iuniteofwork uniteofwork;

        public CountCompanyRequestHandler(Iuniteofwork uniteofwork)
        {
            this.uniteofwork = uniteofwork;
        }

        public async Task<int> Handle(GetCompanyCountQuery request, CancellationToken cancellationToken)
        {
            var count = await uniteofwork.CompanyRepository.CountCompany();
            return count;
        }
    }
}
