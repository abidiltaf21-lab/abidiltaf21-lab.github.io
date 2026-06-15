namespace ReactApi.Domin.Commond_model
{
    public class CreateInboxMessageDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? Telegram { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? ProjectType { get; set; }
        public string? BudgetRange { get; set; }
        public string? Status { get; set; }
    }
}
