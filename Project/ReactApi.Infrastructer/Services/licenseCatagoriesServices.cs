using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Dto.LicenseCatagoies;
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
    public class licenseCatagoriesServices : GenericRepository<LicenseCatagoies>, IlicenseCatagories
    {
       public readonly ApplicationDbContext context;
        public licenseCatagoriesServices(ApplicationDbContext context) : base(context)
        {
            this.context = context;
        }

        public  async Task<PaginatedResult<LicenseCatagoiesdto>> GetCatagories(int PageSize=1, int PageNumber=10)
        {
            var count = await context.licenseCatagoies.CountAsync();
            var licenescatagories = await context.licenseCatagoies
               .Skip((PageNumber - 1) * PageSize)
               .Take(PageSize)
               .Select(x => new LicenseCatagoiesdto
               {
                   Id = x.Id,
                   Name = x.Name,
                   Description = x.Description,
                   Fee = x.Fee,
                   Createdby = x.Createdby,
                   CreatedbyDate = x.CreatedbyDate,
                   Updatedby = x.Updatedby,
                   UpdatedbyDate = x.UpdatedbyDate,
               })
               .ToListAsync();

            return new PaginatedResult<LicenseCatagoiesdto>
            {
                Total = count,
                Data = licenescatagories
            };
        }

        public async Task<PaginatedResult<LicenseCatagoiesdto>> Searching(string? name)
        {
            int PageNumber = 1;
            int PageSize = 10;

            var query = context.licenseCatagoies.AsQueryable();
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(x => x.Name.Contains(name));
            }
           
            var count = await query.CountAsync();
            var search = await query
                .Select(licensobj => new LicenseCatagoiesdto
                {
                    Id = licensobj.Id,
                    Name = licensobj.Name,
                    Description=licensobj.Description,
                    Fee=licensobj.Fee
                })
               .Skip((PageNumber - 1) * PageSize)
                .Take(PageSize)
                .ToListAsync();
            return new PaginatedResult<LicenseCatagoiesdto>
            {
                Total = count,
                Data = search
            };
        }

    }
 
}
