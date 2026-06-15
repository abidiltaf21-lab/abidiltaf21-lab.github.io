using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Application.Fecture.LicenseCatagories.Request.Command;
using ReactApi.Application.Fecture.LicenseCatagories.Request.query;
using ReactApi.Application.Presistance;
using ReactApi.Domin.Commond_model;

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LicenseCatagoriesController : ControllerBase
    {
        private IMediator med;

        public LicenseCatagoriesController(IMediator med) 
        { 
         this.med = med;
        }
        [HttpGet]
        public async Task<IActionResult> FetchCatagories(int PageSize = 10, int PageNumber = 1)
        {
            var GetCatagories = await med.Send(new FetchLicensecatagorRequest {PageSize= PageSize, PageNumber=PageNumber});
            return Ok(GetCatagories);
        }
        [HttpPost]
        public async Task<IActionResult> AddCatagories(LicenseCatagoiesdto catagories)
        {
            var addcatagories = await med.Send(new AddCatagoryRequest {LicenseCatagoiesdto= catagories });
            return Ok(addcatagories);
        }
        [HttpPut]
        public async Task<IActionResult> CatagoryUpdate(LicenseCatagoiesdto catagories)
        {
            var updatecatagory = await med.Send(new UpdateLicenseCatagoriesRequest { LicenseCatagoiesdto= catagories });
            return Ok(updatecatagory);
        }
        [HttpGet("searcing")]
        public async Task<IActionResult> Search_Catagories(string name)
        {

            var serachedvalues = await med.Send(new SearchCatagoriesRequest {name=name});
            return Ok(serachedvalues);
        }
    }
}
