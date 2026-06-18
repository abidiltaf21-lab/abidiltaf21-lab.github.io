using ReactApi.Domin.BaseModel;
using System;

namespace ReactApi.Domin.Commond_model
{
    public class VisitorLog : BaseDomin
    {
        public string? Country { get; set; }
        public string? CountryCode { get; set; }
        public string? City { get; set; }
        public string? Region { get; set; }
        public string? Page { get; set; }
        public string? Section { get; set; }
        public string? SessionId { get; set; }
        public string? IpAddress { get; set; }
        public DateTime VisitedAt { get; set; } = DateTime.UtcNow;
    }
}
