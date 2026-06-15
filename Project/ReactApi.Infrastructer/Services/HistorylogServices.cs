

using Microsoft.EntityFrameworkCore;
using ReactApi.Application;
using ReactApi.Application.Dto.Historylog;
using ReactApi.Application.Presistance;
using ReactApi.Domin;
using ReactApi.Infrastructer.Data;

namespace ReactApi.Infrastructer.Services
{
    public class HistoryLogServices : GenericRepository<HistoryLicenesLogTable>, Ihistorylog
    {
        public ApplicationDbContext context;
        public HistoryLogServices(ApplicationDbContext context) : base(context)
        {
            this.context = context;
        }

        public async Task<List<LogDetalisdto>> LicensesLog(int LicencesId)
        {

            var logdetalis = await (from logobj in context.LIcenesHistoryLog
                                    where logobj.LicensesId==LicencesId
                                    select new LogDetalisdto
                                    {
                                        licenseId = logobj.LicensesId,
                                        PerviseState = logobj.PerviseState,
                                        currentstate = logobj.CurrentStatus,
                                        Reason = logobj.Reason
                                    }).ToListAsync();
            return logdetalis;




        }
    }
}
