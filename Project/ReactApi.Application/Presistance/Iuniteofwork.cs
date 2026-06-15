using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Presistance
{
    public interface Iuniteofwork
    {
        Icompany CompanyRepository { get; }
        IlicenseCatagories LicenseCatagoriesRepository { get; }
        Ilcenses IlcensesRepository {  get; }
        Ihistorylog historylogRepository {  get; }
        public IRepors ReportsRepository { get; }
        public  void Savechanges();
    }
}
