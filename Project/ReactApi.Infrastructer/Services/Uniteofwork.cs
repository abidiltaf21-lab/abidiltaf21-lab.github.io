using ReactApi.Application.Presistance;
using ReactApi.Infrastructer.Data;
using System.ComponentModel;

namespace ReactApi.Infrastructer.Services
{

    public class Uniteofwork : Iuniteofwork
    {
        private ApplicationDbContext context;
        public   Icompany? _company;
        public IlicenseCatagories? _licenseCatagories;
        public Ilcenses? _lcenses;
        public Ihistorylog? _history;
        public IRepors? _reporst;
    
        public Uniteofwork(ApplicationDbContext context)
        {
            this.context = context;
        }

        public Icompany CompanyRepository
        {
            get
            {
                return _company=new CompanyServices(context);
            }
        }

        public IlicenseCatagories LicenseCatagoriesRepository
        {
            get
            {
                return _licenseCatagories=new licenseCatagoriesServices(context);
            }
        }

        public Ilcenses IlcensesRepository
        {
            get
            {
                return _lcenses = new LicenseServices(context);
            }
        }

        public Ihistorylog historylogRepository
        {
            get
            {
                return _history = new HistoryLogServices(context);
            }
        }

        public IRepors ReportsRepository
        {
            get
            {
                return _reporst = new ReportServices(context);
            }
        }

        public void Savechanges()
        {
           context.SaveChanges();
        }
    }
}
