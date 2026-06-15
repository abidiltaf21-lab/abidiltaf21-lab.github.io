using ReactApi.Domin.BaseModel;

namespace ReactApi.Domin.Commond_model
{
    public class Review : BaseDomin
    {
        public required string Author { get; set; }
        public required string Text { get; set; }
        public int Rating { get; set; }
        public string? Project { get; set; }
        public string Status { get; set; } = "pending"; // pending, approved
        public string? Image { get; set; }
        public string? Company { get; set; }
        public string? Website { get; set; }
        public string? SocialLink { get; set; }
        public bool IsApproved { get; set; } = false;
    }
}
