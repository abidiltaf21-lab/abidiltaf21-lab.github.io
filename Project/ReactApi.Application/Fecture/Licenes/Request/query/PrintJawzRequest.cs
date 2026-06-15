using MediatR;
using ReactApi.Application.Dto.Jawazdto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Licenes.Request.query
{
    public class PrintJawzRequest:IRequest<List<Jawazdto>>
    {
        public int licensesid { get; set; }
    }
}
