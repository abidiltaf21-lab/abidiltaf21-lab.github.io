using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Application.Fecture.LicenseCatagories.Request.query;
using ReactApi.Application.Fecture.Reports.Request.query;

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private IMediator med;

        public ReportsController(IMediator med) 
        { 
           this.med= med;
        }
        [HttpGet]
        public async Task<IActionResult> Fechcompaies()
        {
            var listcompanies = await med.Send(new FetchcompanydetalisRequest { });
            return Ok(listcompanies);
        }
        [HttpGet("byStatus")]
        public async Task<IActionResult> FetchLicences_by_Status(int Status)
        {
            var Licenses = await med.Send(new FetchLicencesbyStatusRequest { Status=Status});
            return Ok(Licenses);
        }


    }
}
