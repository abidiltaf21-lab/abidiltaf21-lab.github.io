using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Application.Fecture.LicenseCatagories.Request.Command;
using ReactApi.Application.Presistance;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.LicenseCatagories.Handler.Command
{
    public class AddCatagoryRequestHandler : IRequestHandler<AddCatagoryRequest, LicenseCatagoiesdto>
    {
        private Iuniteofwork uniteofwork;
        private IMapper mapper;
        private IHttpContextAccessor accessor;

        public AddCatagoryRequestHandler(Iuniteofwork uniteofwork,IMapper mapper, IHttpContextAccessor accessor)
        {
            this.uniteofwork = uniteofwork;
            this.mapper= mapper;
            this.accessor = accessor;
        }
        public async Task<LicenseCatagoiesdto> Handle(AddCatagoryRequest request, CancellationToken cancellationToken)
        {
            request.LicenseCatagoiesdto.Createdby = accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User Not Found");
            request.LicenseCatagoiesdto.CreatedbyDate = DateOnly.FromDateTime(DateTime.UtcNow);
            var entity = mapper.Map<LicenseCatagoies>(request.LicenseCatagoiesdto);
              uniteofwork.LicenseCatagoriesRepository.Add(entity);
              uniteofwork.Savechanges();
            var result = mapper.Map<LicenseCatagoiesdto>(entity);
            return result;
        }
    }
}
