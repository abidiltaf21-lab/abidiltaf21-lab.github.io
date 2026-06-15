using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Fecture.Company.Request.Command;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Handler.Command
{
    public class AddCompanyRequestHandler : IRequestHandler<AddCompanyRequest, CompanyDto>
    {
        private Iuniteofwork uniteofwork;
        private IMapper mapper;
        private IHttpContextAccessor accessor;

        public AddCompanyRequestHandler(Iuniteofwork uniteofwork,IMapper mapper, IHttpContextAccessor accessor)
        {
            this.uniteofwork = uniteofwork;
          this.mapper= mapper;
            this.accessor= accessor;
        }
        public async Task<CompanyDto> Handle(AddCompanyRequest request, CancellationToken cancellationToken)

        {
            request.Companydto.Createdby = accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User Not Found");
            request.Companydto.CreatedbyDate = DateOnly.FromDateTime(DateTime.UtcNow);
            var company =   mapper.Map<ReactApi.Domin.Commond_model.Companies>(request.Companydto);
               uniteofwork.CompanyRepository.Add(company);
            uniteofwork.Savechanges();
             var mappdto= mapper.Map<CompanyDto>(company);
            return mappdto;
           
        }
    }
}
