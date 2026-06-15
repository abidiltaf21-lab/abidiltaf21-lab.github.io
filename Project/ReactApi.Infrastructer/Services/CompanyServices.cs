using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Presistance;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Infrastructer.Services
{
    public class CompanyServices : GenericRepository<Companies>, Icompany
    {
        private readonly ApplicationDbContext context;
        public CompanyServices(ApplicationDbContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<int> CountCompany()
        {
            var count = await context.Companies.CountAsync();
            return count;
        }

     

        public async Task<List<LicenseDetliasedto>> FetchJawaz(int CompanyId)
        {
            var listjawaz=await (from licensobj in context.Licenses 
                                 join compobj in context.Companies on licensobj.CompanyId equals compobj.Id
                                 join catobj in context.licenseCatagoies on licensobj.CategoryId equals catobj.Id
                                 where licensobj.CompanyId == CompanyId
                          select new LicenseDetliasedto
                          {
                              //companyInfo
                               Id=licensobj.Id,
                               CompanyId= licensobj.CompanyId,
                               CompanyName=compobj.Company_Name,
                               ComericalName=compobj.Company_Name,
                               TIN_ID=compobj.TIN_ID,
                              Email=compobj.Email,
                              Address=compobj.Address,
                              Phone_Number=compobj.Phone_Number,
                              //catagory info
                               CategoryId=licensobj.CategoryId,
                               CategoryName=catobj.Name,
                              Fee =catobj.Fee,
                              Status=(StatusEnum)licensobj.Status,
                              //Licenses info
                              LicenseNumber =licensobj.LicenseNumber,
                              Regno=licensobj.Regno,
                               IssueDate=licensobj.IssueDate,
                               ExpiryDate=licensobj.ExpiryDate,
                               Createdby=licensobj.Createdby,
                               CreatedbyDate=licensobj.CreatedbyDate,
                          }).ToListAsync();
            return listjawaz;
        }

        public  async Task<PaginatedResult<CompanyDto>>  GetCompaniesList(int PageSize, int PageNumber)
        {
            var count = await context.Companies.CountAsync();

            var companies = await  context.Companies
                .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .Select(x => new CompanyDto
                {
                    Id = x.Id,
                    Company_Name = x.Company_Name,
                    English_Name = x.English_Name,
                    TIN_ID= x.TIN_ID,
                    Phone_Number = x.Phone_Number,
                    Email=x.Email,
                    Address=x.Address,
                    IssueDate = x.IssueDate,
                    Createdby=x.Createdby,
                    CreatedbyDate=x.CreatedbyDate,
                    Updatedby=x.Updatedby,
                    UpdatedbyDate=x.UpdatedbyDate,
                  
                })
                .ToListAsync();

            return   new  PaginatedResult<CompanyDto>
            {
                Total = count,
                Data = companies
            };


        }

        public async Task<PaginatedResult<CompanyDto>> SearchCompany(string? Company_Name, string? English_Name)
        {
            int PageNumber =1;
            int PageSize = 10;

            var query = context.Companies.AsQueryable();
            if (!string.IsNullOrWhiteSpace(Company_Name))
            {
                query = query.Where(x => x.Company_Name.Contains(Company_Name));
            }
            if (!string.IsNullOrWhiteSpace(English_Name))
            {
                query = query.Where(x => x.English_Name.Contains(English_Name));
            }
            var count = await query.CountAsync();
            var search = await query
                .Select(compobj => new CompanyDto
                {
                    Id=compobj.Id,
                    Company_Name = compobj.Company_Name,
                    English_Name = compobj.English_Name,
                    TIN_ID = compobj.TIN_ID,
                    Phone_Number=compobj.Phone_Number,
                    Address = compobj.Address,
                    Email = compobj.Email,
                })
               .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();
            return new PaginatedResult<CompanyDto>
            {
                Total = count,
                Data = search
            };
        }
    }
}
