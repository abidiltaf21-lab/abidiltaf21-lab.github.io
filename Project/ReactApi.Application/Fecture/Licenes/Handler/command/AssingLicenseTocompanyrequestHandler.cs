using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Fecture.Licenes.Request.command;
using ReactApi.Application.Presistance;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Handler.command
{
    public class AssingLicenseTocompanyrequestHandler : IRequestHandler<AssingLicenseTocompanyrequest, Licensesdto>
    {
        private Iuniteofwork uniteofwork;
        private IMapper mapper;
        private IHttpContextAccessor accessor;

        public AssingLicenseTocompanyrequestHandler(Iuniteofwork uniteofwork,IMapper mapper, IHttpContextAccessor accessor)
        {
            this.uniteofwork= uniteofwork;
            this.mapper= mapper;
            this.accessor= accessor;
        }
        public async Task<Licensesdto> Handle(AssingLicenseTocompanyrequest request, CancellationToken cancellationToken)
        {
             request.licensesdto.Createdby = accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User Not Found");
             request.licensesdto.CreatedbyDate = DateOnly.FromDateTime(DateTime.UtcNow);
            var company = uniteofwork.CompanyRepository.GetbyId(request.CompanyId);
            //checking if the company exist or not
            if (company == null)
                throw new Exception("Company not found");
            //checking if the category exist or not
            var categoryExists = uniteofwork.LicenseCatagoriesRepository
                .GetbyId(request.licensesdto.CategoryId);
            if (categoryExists == null)
                throw new Exception("Invalid CategoryId");
            // ✅ 🔥 ADD DUPLICATE CHECK HERE
            var exists = await uniteofwork.IlcensesRepository.ExistsAsync(request.CompanyId, request.licensesdto.CategoryId);
            if (exists)
            {
                throw new Exception("DUPLICATE_CATEGORY");
            }

            // 🔥 GENERATE LICENSE NUMBER HERE
            var licenseNumber = await uniteofwork.IlcensesRepository.GenerateLicenseNumber((DateOnly)request.licensesdto.CreatedbyDate);
            request.licensesdto.LicenseNumber = licenseNumber;
            uniteofwork.IlcensesRepository.Addchild(request.CompanyId, request.licensesdto);
            uniteofwork.Savechanges();

            return request.licensesdto;
        }
    }
}
