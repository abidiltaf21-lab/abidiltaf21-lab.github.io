using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Application.Dto.Gregorian;
using ReactApi.Application.Dto.Jawazdto;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Application.Presistance;
using ReactApi.Domin;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
 
namespace ReactApi.Infrastructer.Services
{
    public class LicenseServices : GenericRepository<Licenses>, Ilcenses
    {
        public ApplicationDbContext context;
        public LicenseServices(ApplicationDbContext context) : base(context)
        {
            this.context = context;
        }
        public void Addchild(int CompanyId, Licensesdto dto)
        {
            var license = new Licenses()
            {
                Id = dto.Id,
                CompanyId = CompanyId, // ✅ foreign key
                CategoryId = dto.CategoryId,
                LicenseNumber = dto.LicenseNumber,
                Regno= dto.Regno,
                IssueDate = dto.IssueDate,
                ExpiryDate = dto.ExpiryDate,
                Status = (int)StatusEnum.Active, // Assuming new licenses are active by default
                Createdby = dto.Createdby,
                CreatedbyDate = dto.CreatedbyDate
            };

            context.Licenses.Add(license);
        }

        public async Task<LicensEditdto?> EditLicens(int Id)
        {
            var Licenes = (from licensobj in context.Licenses
                           join catobj in context.licenseCatagoies on licensobj.CategoryId equals catobj.Id
                           where licensobj.Id == Id
                           select new LicensEditdto
                           {
                               Id = licensobj.Id,
                               CategoryId = licensobj.CategoryId,
                               CompanyId=licensobj.CompanyId,
                               LicenseNumber = licensobj.LicenseNumber,
                               Regno=licensobj.Regno,
                               IssueDate = licensobj.IssueDate,
                               ExpiryDate = licensobj.ExpiryDate,
                               Createdby = licensobj.Createdby,
                               CreatedbyDate = licensobj.CreatedbyDate
                           }).FirstOrDefault();
            return Licenes;
        }

        public async Task<PaginatedResult<Licensesdto>> Fetchlicense(int PageSize, int PageNumber)
        {
            var count = context.Licenses.Count();
            var licenses = await (from lincesobj in context.Licenses

                                  select new Licensesdto
                                  {
                                      Id = lincesobj.Id,
                                      CompanyId = lincesobj.CompanyId,
                                      CategoryId = lincesobj.CategoryId,
                                      LicenseNumber = lincesobj.LicenseNumber,
                                   Regno= lincesobj.Regno,
                                      IssueDate = lincesobj.IssueDate,
                                      ExpiryDate = lincesobj.ExpiryDate,

                                  })
                         .Skip(PageSize - 1).
                         Take(PageNumber).
                         ToListAsync();
            return new PaginatedResult<Licensesdto>
            {
                Data = licenses,
                Total = count,
            };
        }

        void Ilcenses.UpdateLicens(LicensEditdto dto)
        {
            var license = context.Licenses.Find(dto.Id);
            if (license != null)
            {
                license.CategoryId = dto.CategoryId;
                license.LicenseNumber = dto.LicenseNumber;
                license.IssueDate = dto.IssueDate;
                license.Regno = dto.Regno;
                license.ExpiryDate = dto.ExpiryDate;
                license.Updatedby = dto.Createdby;
                license.UpdatedbyDate = dto.CreatedbyDate;
                context.Licenses.Update(license);
            }

        }
        public async Task<bool> ExistsAsync(int companyId, int categoryId, int? excludeId = null)
        {
            return await context.Licenses
            .AnyAsync(x =>
           x.CompanyId == companyId &&
           x.CategoryId == categoryId &&
           (excludeId == null || x.Id != excludeId) // ✅ for update
       );
        }

        public async Task<string> GenerateLicenseNumber(DateOnly date)
        {
            int year = DateHelper.GetPersianYear(date); // ✔ correct type
            string prefix = $"MCIT-ICT-{year}-";
            var lastLicense = await context.Licenses
                .Where(x => x.LicenseNumber.StartsWith(prefix))
                .OrderByDescending(x => x.LicenseNumber)
                .Select(x => x.LicenseNumber)
                .FirstOrDefaultAsync();

            int nextSequence = 001;

            if (!string.IsNullOrEmpty(lastLicense))
            {
                var parts = lastLicense.Split('-');
                nextSequence = int.Parse(parts[^1]) + 1;
            }
            return $"{prefix}{nextSequence:D3}";
        }

        public async Task<List<LicenseStatusCountDto>> CountLicences()
        {
            var statuses = new List<int> { 1, 2, 3, 4 };

            var result = await context.Licenses
                .Where(x => statuses.Contains(x.Status))
                .GroupBy(x => x.Status)
                .Select(g => new LicenseStatusCountDto
                {
                    Status = g.Key,
                    Counte = g.Count()
                })
                .ToListAsync();
            return result;
        }

        public async Task<List<Jawazdto>> PrintJawaz(int licensesid)
        {
           var Jawaz= await (from companyobj in context.Companies
                     join licencesobj in context.Licenses on companyobj.Id equals licencesobj.CompanyId
                     join catagories in context.licenseCatagoies on licencesobj.CategoryId equals catagories.Id
                     where licencesobj.Id == licensesid
                             select new Jawazdto
                     { 
                         //Company Information
                         Company_Name=companyobj.Company_Name,
                         English_Name1= companyobj.English_Name,
                         company_Adress =companyobj.Address,
                         TIN_ID=companyobj.TIN_ID,
                         Company_estblish_mentyear=companyobj.IssueDate,
                         //catagories information
                         Name=catagories.Name,
                         //licences information
                         LicenseNumber=licencesobj.LicenseNumber,
                         IssueDate=licencesobj.IssueDate,
                         ExpiryDate=licencesobj.ExpiryDate,
                         Regno=licencesobj.Regno,
                     }).ToListAsync();
            return Jawaz;
        }
    }
    }



