using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Fecture.Licenes.Request.command;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Handler.command
{
    public class UpdateLicensRecordRequestHandler : IRequestHandler<UpdateLicensRecordRequest, LicensEditdto>
    {
        private IHttpContextAccessor accessor;
        private Iuniteofwork uniteofwrok;
        private readonly IMapper mapper;

        public UpdateLicensRecordRequestHandler(Iuniteofwork uniteofwrok,IHttpContextAccessor accessor,IMapper mapper)
        {
            this.accessor= accessor;
            this.uniteofwrok= uniteofwrok;
            this.mapper = mapper;
        }
        public async Task<LicensEditdto> Handle(UpdateLicensRecordRequest request, CancellationToken cancellationToken)
        {

            var userId = accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User Not Found");
            var dto = request.LicensEditdto;
            // ✅ Use Updated fields (NOT Created)
            dto.Updatedby = userId;
            dto.UpdatedbyDate = DateOnly.FromDateTime(DateTime.UtcNow);
            // ✅ 🔥 ADD DUPLICATE CHECK HERE
            //var exists = await uniteofwrok.IlcensesRepository.ExistsAsync(request.LicensEditdto.CompanyId, request.LicensEditdto.CategoryId);
            //if (exists)
            //{
            //    throw new Exception("DUPLICATE_CATEGORY");
            //}



            // Update in repository
            uniteofwrok.IlcensesRepository.UpdateLicens(dto);
            uniteofwrok.Savechanges();
            return dto;


        }

    }
    }

