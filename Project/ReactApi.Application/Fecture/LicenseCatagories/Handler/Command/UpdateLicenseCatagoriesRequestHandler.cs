using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Application.Fecture.LicenseCatagories.Request.Command;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.LicenseCatagories.Handler.Command
{
    public class UpdateLicenseCatagoriesRequestHandler : IRequestHandler<UpdateLicenseCatagoriesRequest, LicenseCatagoiesdto>
    {
        private Iuniteofwork uniteofwork;
        private IMapper mapper;
        private IHttpContextAccessor accessor;

        public UpdateLicenseCatagoriesRequestHandler(Iuniteofwork uniteofwork,IMapper mapper, IHttpContextAccessor accessor)
        {
            this.uniteofwork= uniteofwork;
            this.mapper= mapper;
            this.accessor= accessor;
        }
        public async Task<LicenseCatagoiesdto> Handle(UpdateLicenseCatagoriesRequest request, CancellationToken cancellationToken)
        {
            request.LicenseCatagoiesdto.Updatedby = accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User Not Found");
            request.LicenseCatagoiesdto.UpdatedbyDate = DateOnly.FromDateTime(DateTime.UtcNow);
            var entity = uniteofwork.LicenseCatagoriesRepository.GetbyId(request.LicenseCatagoiesdto.Id);
            // map DTO INTO existing entity
            mapper.Map(request.LicenseCatagoiesdto, entity);
            uniteofwork.LicenseCatagoriesRepository.Update(entity);
              uniteofwork.Savechanges();
            var result = mapper.Map<LicenseCatagoiesdto>(entity);
            return result;
        }
    }
}
