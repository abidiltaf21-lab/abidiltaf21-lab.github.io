using MediatR;
using ReactApi.Application.Dto.LicenseCatagoies;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.LicenseCatagories.Request.query
{
    public class SearchCatagoriesRequest:IRequest<PaginatedResult<LicenseCatagoiesdto>>
    {
       public string name { get; set; }
    }
}
