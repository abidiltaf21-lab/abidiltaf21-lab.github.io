using ReactApi.Domin.BaseModel;
using System;

namespace ReactApi.Domin.Commond_model
{
    public class ClientRequest : BaseDomin
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public string? Phone { get; set; }
        public string? Telegram { get; set; }
        public string? BudgetRange { get; set; }
        public string? ProjectType { get; set; }
        public required string Message { get; set; }
        public string? Status { get; set; } = "New";
        public bool IsRead { get; set; } = false;
        public string? InternalNotes { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
