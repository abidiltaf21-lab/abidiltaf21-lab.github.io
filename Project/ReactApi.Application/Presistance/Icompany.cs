using ReactApi.Application.Dto.Company;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Presistance
{
    public interface Icompany : IGenericRepository<Companies>
    { 
        Task<PaginatedResult<CompanyDto>> GetCompaniesList(int PageSize, int PageNumber);
        Task<PaginatedResult<CompanyDto>> SearchCompany(string? Company_Name, string? English_Name);
        Task<List<LicenseDetliasedto>> FetchJawaz(int CompanyId);
        Task<int> CountCompany();
    
    }      
}
