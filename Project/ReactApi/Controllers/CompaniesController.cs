using MediatR;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Fecture.Company.Request.Command;
using ReactApi.Application.Fecture.Company.Request.query;

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private IMediator med;

        public CompaniesController(IMediator med)
        {
            this.med = med;
        }
        [HttpGet]
        public async Task<IActionResult> GetListCompanies(int PageSize=10, int PageNumber=1)
        {
            var listcomapies = await med.Send(new GetAllCompaniesQuery { PageSize= PageSize ,PageNumber=PageNumber});
            return Ok(listcomapies);
        }





        [HttpGet("Search")]
        public async Task<IActionResult> SearchCompany(string? Company_Name, string? English_Name)
        {
            var searching = await med.Send(new SearchingCompanyRequest { English_Name = English_Name, Company_Name=Company_Name});
            return Ok(searching);

        }
        [HttpGet("Countcompanies")]
         public async Task<IActionResult> CountCompany()
        {
            var count=await med.Send(new GetCompanyCountQuery { });
            return Ok(count);
        }
        [HttpPost]
        public async Task<IActionResult> AddCompany(CompanyDto company)
        {
            var AddComapy = await med.Send(new AddCompanyRequest { Companydto = company });
            return Ok(AddComapy);
        }
        [HttpPut]
        public async Task<IActionResult> CompanyUpdate(CompanyDto company)
        {
            var Updat_Company = await med.Send(new UpdateCompanyRequest {companyDto= company });
            return Ok(Updat_Company);
        }
    }
}
