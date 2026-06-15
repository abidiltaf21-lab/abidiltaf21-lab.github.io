using MediatR;
using ReactApi.Application.Dto.Licensesdto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Request.query
{
    public class FetchLicnsesRequest:IRequest<PaginatedResult<Licensesdto>>
    {
        public int PageSize { get; set; }
        public int PageNumber { get; set; }
    }
}
