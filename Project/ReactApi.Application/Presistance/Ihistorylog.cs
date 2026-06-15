using ReactApi.Application.Dto.Historylog;
using ReactApi.Domin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Presistance
{
    public interface Ihistorylog :IGenericRepository<HistoryLicenesLogTable>
    {
        Task<List<LogDetalisdto>> LicensesLog(int LicencesId);
    }
}
