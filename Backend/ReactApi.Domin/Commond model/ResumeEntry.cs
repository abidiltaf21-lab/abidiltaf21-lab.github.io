using ReactApi.Domin.BaseModel;

namespace ReactApi.Domin.Commond_model
{
    /// <summary>
    /// Experience or education timeline item for the public resume section.
    /// Type: "experience" | "education"
    /// </summary>
    public class ResumeEntry : BaseDomin
    {
        public required string Type { get; set; }
        public required string Title { get; set; }
        public required string Subtitle { get; set; }
        public required string DateRange { get; set; }
        public required string Description { get; set; }
        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;

        public int? TeamMemberId { get; set; }
        [System.Text.Json.Serialization.JsonIgnore]
        public TeamMember? TeamMember { get; set; }
    }
}
