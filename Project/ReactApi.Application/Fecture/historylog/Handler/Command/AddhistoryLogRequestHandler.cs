using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.Http;
using ReactApi.Application.Dto.Historylog;
using ReactApi.Application.Fecture.historylog.Request.Command;
using ReactApi.Application.Presistance;
using ReactApi.Domin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.historylog.Handler.Command
{
    public class AddhistoryLogRequestHandler : IRequestHandler<AddhistoryLogRequest, historylogdto>
    {
        private Iuniteofwork uniteofwork;
        private IMapper mapper;
        private IHttpContextAccessor accessor;

        public AddhistoryLogRequestHandler(Iuniteofwork uniteofwork,IMapper mapper,IHttpContextAccessor accessor) 
        { 
         this.uniteofwork=uniteofwork;
            this.mapper = mapper;
            this.accessor= accessor;
        }
        public async Task<historylogdto> Handle(AddhistoryLogRequest request, CancellationToken cancellationToken)
        {

            request.historylogdto.Createdby= accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("User Not Found");
            request.historylogdto.CreatedbyDate = DateOnly.FromDateTime(DateTime.UtcNow);
            // 1️⃣ Get license
            var licenses =   uniteofwork.IlcensesRepository
                .GetbyId(request.historylogdto.licenseId);

            if (licenses == null)
            {
                throw new Exception("licenses not found");
            }

            // 2️⃣ previous state
            var perivasestate = licenses.Status;

            // 3️⃣ create history log
            var log = new HistoryLicenesLogTable
            {
                LicensesId = licenses.Id,
                PerviseState = perivasestate,
                CurrentStatus = request.historylogdto.currentstate,
                Reason = request.historylogdto.Reason,
                Createdby= request.historylogdto.Createdby,
                CreatedbyDate=request.historylogdto.CreatedbyDate
               
            };

            // 4️⃣ update license
            licenses.Status = request.historylogdto.currentstate;

            // 5️⃣ save both
              uniteofwork.historylogRepository.Add(log);
            uniteofwork.IlcensesRepository.Update(licenses);
              uniteofwork.Savechanges();
            // 6️⃣ return DTO (ONLY HERE mapping is correct)
            return mapper.Map<historylogdto>(log);
        }
    }
}
