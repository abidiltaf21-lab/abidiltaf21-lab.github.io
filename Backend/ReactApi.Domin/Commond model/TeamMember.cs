using System.Collections.Generic;
using ReactApi.Domin.BaseModel;

namespace ReactApi.Domin.Commond_model
{
    public class TeamMember : BaseDomin
    {
        public required string Name { get; set; }
        public required string Role { get; set; }
        public string? Image { get; set; }
        public string? Bio { get; set; }
        public string? Twitter { get; set; }
        public string? Linkedin { get; set; }
        public string? Instagram { get; set; }
        public string? Skills { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;

        // Navigation property for resume entries
        public ICollection<ResumeEntry> ResumeEntries { get; set; } = new List<ResumeEntry>();
    }
}
