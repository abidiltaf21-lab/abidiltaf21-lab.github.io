using MediatR;
using ReactApi.Application.Dto.Historylog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.historylog.Request.query
{
    public class LogdetalisRequest:IRequest<List<LogDetalisdto>>
    {
        public int licenseId { get; set; }
    }
}
