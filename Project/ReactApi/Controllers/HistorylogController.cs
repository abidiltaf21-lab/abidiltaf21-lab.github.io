using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Application.Dto.Historylog;
using ReactApi.Application.Fecture.historylog.Request.Command;
using ReactApi.Application.Fecture.historylog.Request.query;

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistorylogController : ControllerBase
    {
        private IMediator med;

        public HistorylogController(IMediator med) 
        { 
         this.med= med;
        }

        [HttpGet]
        public async Task<IActionResult> liceneslogdetalice(int licenseId)
        {
            var logs = await med.Send(new LogdetalisRequest { licenseId = licenseId });
            return Ok(logs);
        }



        [HttpPost]
        public async Task<IActionResult> Licenselog(historylogdto dto)
        {
            var log = await med.Send(new AddhistoryLogRequest { historylogdto=dto});
            return Ok(log);
        }
    }
}
