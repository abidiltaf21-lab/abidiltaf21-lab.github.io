using System.Security.Claims;

namespace ReactApi.Application.Dto.Identity.Claims
{
    public static class ClaimsStore
    {
        public static List<Claim> AllClaims { get; } = new List<Claim>
        {
            //User
            new Claim("ListUser", "ListUser"),
            new Claim("CreateNewUser", "CreateNewUser"),
            new Claim("UpdateUser", "UpdateUser"),
            new Claim("UpdatePassword", "UpdatePassword"),
            //new Claim("DeleteUser", "DeleteUser"),
              new Claim("AssignRole", "AssignRole"),
            //Role
            new Claim("ListRole", "ListRole"),
            new Claim("CreateNewRole", "CreateNewRole"),
            new Claim("UpdateRole", "UpdateRole"),
            //new Claim("DeleteRole", "DeleteRole"),
            new Claim("AssignPermissions", "AssignPermissions"),
            //Company
             new Claim("ListCompanies", "ListCompanies"),
             new Claim("CreateCompany", "CreateCompany"),
             new Claim("EditCompany", "EditCompany"),
             new Claim("SearchCompany", "SearchCompany"),
             //Catagories
             new Claim("Listcatagories", "Listcatagories"),
             new Claim("AddCatagory", "AddCatagory"),
             new Claim("EditCatagory", "EditCatagory"),
             //Licences
              new Claim("ViewLicences", "ViewLicences"),
              new Claim("AddLicences", "AddLicences"),
              new Claim("EditLicences", "EditLicences"),
              new Claim("Licenceshistory", "Licenceshistory"),
              new Claim("Viewlicenceshistory", "Viewlicenceshistory"),
              new Claim("PrintJawaz", "PrintJawaz"),
        };
    }
}
