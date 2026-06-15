using MediatR;
using ReactApi.Application.Dto.LicenseCatagoies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.LicenseCatagories.Request.query
{
    public class FetchLicensecatagorRequest:IRequest<PaginatedResult<LicenseCatagoiesdto>>
    {
       public  int PageSize { get; set; }
        public int PageNumber { get; set; }
    }
}
