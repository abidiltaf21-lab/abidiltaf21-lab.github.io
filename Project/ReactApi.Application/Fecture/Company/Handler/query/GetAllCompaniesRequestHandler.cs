using AutoMapper;
using MediatR;
using ReactApi.Application.Dto.Company;
using ReactApi.Application.Fecture.Company.Request.query;
using ReactApi.Application.Presistance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.Marshalling;
using System.Text;
using System.Threading.Tasks;

namespace ReactApi.Application.Fecture.Company.Handler.query
{
    public class GetAllCompaniesRequestHandler : IRequestHandler<GetAllCompaniesQuery, PaginatedResult<CompanyDto>>
    {
        private Iuniteofwork uniteofwork;
        private IMapper mapper;

        public GetAllCompaniesRequestHandler(Iuniteofwork uniteofwork, IMapper mapper)
        {
            this.uniteofwork = uniteofwork;
            this.mapper = mapper;
        }
        public async Task<PaginatedResult<CompanyDto>> Handle(GetAllCompaniesQuery request, CancellationToken cancellationToken)
        {
            var Allcommpany = await uniteofwork.CompanyRepository.GetCompaniesList(request.PageSize,request.PageNumber);
            return Allcommpany;
        }}
    }


