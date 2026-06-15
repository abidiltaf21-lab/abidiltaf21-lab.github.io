using ReactApi.Domin.BaseModel;
namespace ReactApi.Application.Dto.Company
{
    public class CompanyDto:BaseDomin
    {
        public required string Company_Name { get; set; }
        public required string English_Name { get; set; }
        public required string TIN_ID { get; set; }
        public required string Phone_Number { get; set; }
        public required string Email { get; set; }
        public required string Address { get; set; }
        public string IssueDate { get; set; }
    }
}
