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
    public class UpdateCompanyRequestHandler : IRequestHandler<UpdateCompanyRequest, CompanyDto>
    {
        private Iuniteofwork uniteofwork;
        private IMapper mapper;
        private IHttpContextAccessor accessor;

        public UpdateCompanyRequestHandler(Iuniteofwork uniteofwork,IMapper mapper, IHttpContextAccessor accessor) 
        {
            this.uniteofwork = uniteofwork;
            this.mapper= mapper;
            this.accessor= accessor;

        }
        public async Task<CompanyDto> Handle(UpdateCompanyRequest request, CancellationToken cancellationToken)
        {
            request.companyDto.Updatedby =  accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User Not Found");
            request.companyDto.UpdatedbyDate = DateOnly.FromDateTime(DateTime.UtcNow);
         var company=uniteofwork.CompanyRepository.GetbyId(request.companyDto.Id);
            mapper.Map(request.companyDto, company);
            uniteofwork.CompanyRepository.Update(company);
            uniteofwork.Savechanges();
            var mapp=mapper.Map<CompanyDto>(company);
            return mapp;

        }
    }
}
