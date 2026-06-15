using MediatR;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Fecture.Company.Request.query;
using ReactApi.Application.Fecture.Licenes.Request.command;
using ReactApi.Application.Fecture.Licenes.Request.query;
 

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicensesController : ControllerBase
    {
        private IMediator med;

        public LicensesController(IMediator med)
        {
            this.med = med;
        }
        [HttpGet]
        public async Task<IActionResult> GetLicenses(int PageSize = 10, int PageNumber = 1)
        {
            var listlicenses = await med.Send(new FetchLicnsesRequest { PageSize = PageSize, PageNumber = PageNumber });
            return Ok(listlicenses);
        }
        [HttpPost]
        public async Task<IActionResult> AddLicense(int companyId, [FromBody] Licensesdto dto)
        {
            var result = await med.Send(new AssingLicenseTocompanyrequest { CompanyId = companyId, licensesdto = dto });
            return Ok(result);
        }
        [HttpGet("listjwaz")]
        public async Task<IActionResult> FetchJwazlist(int CompanyId)
        {
            var result = await med.Send(new FetchjawazofcompanyRequest { CompanyId = CompanyId });
            return Ok(result);

        }
        [HttpGet("FindLicens")]
        public async Task<IActionResult> EditLicens(int Id)
        {
            var FindLicenes = await med.Send(new EditLicenesRequest { Id = Id });
            return Ok(FindLicenes);
        }
        [HttpPut]
        public async Task<IActionResult> UpdatelicenesRecord(LicensEditdto dto)
        {
            var licens = await med.Send(new UpdateLicensRecordRequest { LicensEditdto = dto });
            return Ok(licens);
        }

        [HttpGet("CountLicenses")]
        public async Task<IActionResult> LicensesCount()
        {
            var licensescount = await med.Send(new CountLicencesRequest { });
            return Ok(licensescount);
        }

        [HttpGet("PrintIctJwaz")]
        public async Task<IActionResult> PrintJwaz(int licensesid)
        {
            var listjwaz = await med.Send(new PrintJawzRequest { licensesid = licensesid });
            return Ok(listjwaz);
        }



 
    }
}
