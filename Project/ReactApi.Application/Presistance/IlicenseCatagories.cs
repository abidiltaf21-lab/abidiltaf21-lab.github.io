using ReactApi.Application.Dto.Company;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Presistance
{
    public interface IlicenseCatagories:IGenericRepository<LicenseCatagoies>
    {
        Task<PaginatedResult<LicenseCatagoiesdto>> GetCatagories(int PageSize, int PageNumber);
        Task<PaginatedResult<LicenseCatagoiesdto>> Searching(string? name);
    }
}
