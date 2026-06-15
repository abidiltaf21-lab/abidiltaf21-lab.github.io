using AutoMapper;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Dto.Historylog;
using ReactApi.Application.Dto.LicenseCatagoies;
using ReactApi.Application.Dto.Licensesdto;
using ReactApi.Domin;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Mapping
{
    public class Mpping:Profile
    {
        public Mpping()
        {
          CreateMap<Companies,CompanyDto>().ReverseMap();
          CreateMap<LicenseCatagoies, LicenseCatagoiesdto>().ReverseMap();
            CreateMap<Licenses, Licensesdto>().ReverseMap();
            CreateMap<Licenses, LicensEditdto>().ReverseMap();
            CreateMap<HistoryLicenesLogTable,historylogdto>().ReverseMap();
        }
    }
}
