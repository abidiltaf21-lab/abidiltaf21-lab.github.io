using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Presistance;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Infrastructer.Services
{
    public class ReportServices : GenericRepository<LicenseCatagoies>, IRepors
    {
        public ApplicationDbContext context;

        public ReportServices(ApplicationDbContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<PaginatedResult<CompanyDto>> FetchCompanies()
        {
            var Total = await context.Companies.CountAsync();
            var listcompanies = await context.Companies.Select(x => new CompanyDto
            {
                Id = x.Id,
                Company_Name = x.Company_Name,
                English_Name = x.English_Name,
                TIN_ID = x.TIN_ID,
                Phone_Number = x.Phone_Number,
                Email = x.Email,
                Address = x.Address,
                IssueDate = x.IssueDate,
            }).ToListAsync();
            return new PaginatedResult<CompanyDto>
            {
                Data = listcompanies,
                Total = Total
            };
        }

        public async Task<PaginatedResult<LicenseDetliasedto>> FetchLicences_by_Status(int Status)
        {
            var query = context.Licenses.Where(x => x.Status == Status);//7

            var totalCount = await query.CountAsync();
            var data= await (from compobj in context.Companies join licencesobj in context.Licenses on compobj.Id equals licencesobj.CompanyId
                      join cataobj in context.licenseCatagoies on licencesobj.CategoryId equals cataobj.Id
                      where licencesobj.Status == Status
                      select new LicenseDetliasedto
                      {
                          CompanyId=licencesobj.CompanyId,
                          ComericalName=compobj.English_Name,
                          Address=compobj.Address,
                          TIN_ID=compobj.TIN_ID,
                         Companyissuedate=compobj.IssueDate,
                          Email=compobj.Email,
                          Phone_Number=compobj.Phone_Number,
                          CategoryId=cataobj.Id,
                          CategoryName=cataobj.Name,
                          Fee=cataobj.Fee,
                          LicenseNumber=licencesobj.LicenseNumber,
                          Regno = licencesobj.Regno,
                          Status=(StatusEnum)licencesobj.Status,
                          IssueDate = licencesobj.IssueDate,
                          ExpiryDate = licencesobj.ExpiryDate,
                      }).ToListAsync();
            return new PaginatedResult<LicenseDetliasedto>
            {
                Total = totalCount,
                Data = data
            };

        }

       
    }
}
