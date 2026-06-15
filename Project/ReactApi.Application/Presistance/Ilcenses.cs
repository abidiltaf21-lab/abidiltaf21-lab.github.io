using ReactApi.Application.Dto.Jawazdto;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Domin;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Presistance
{
    public interface Ilcenses:IGenericRepository<Licenses>
    {
        Task<PaginatedResult<Licensesdto>> Fetchlicense(int PageSize, int PageNumber);
        void Addchild(int CompanyId,Licensesdto dto);
        Task<LicensEditdto?> EditLicens(int Id);
        void UpdateLicens(LicensEditdto dto);
        Task<bool> ExistsAsync(int companyId, int categoryId, int? excludeId = null);
        Task<string> GenerateLicenseNumber(DateOnly date);
        Task<List<LicenseStatusCountDto>> CountLicences();
        Task<List<Jawazdto>> PrintJawaz(int licensesid);
    }                                                   
}
