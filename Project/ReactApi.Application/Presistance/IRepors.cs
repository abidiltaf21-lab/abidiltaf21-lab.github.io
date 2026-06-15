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
    public interface IRepors:IGenericRepository<LicenseCatagoies>
    {
        Task<PaginatedResult<CompanyDto>> FetchCompanies();
        Task<PaginatedResult<LicenseDetliasedto>> FetchLicences_by_Status(int Status);
    }
}
