using ReactApi.Domin.BaseModel;

namespace ReactApi.Domin.Commond_model
{
    public class Service : BaseDomin
    {
        public required string Title { get; set; }
        public required string Text { get; set; }
        public string? Icon { get; set; }
        public string? VideoUrl { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; } = true;
        public decimal Price { get; set; } = 0;
        public string? FeaturesJson { get; set; }

        // Details fields
        public string? MainTitle { get; set; }
        public string? Description { get; set; }
        public string? SecondaryDescription { get; set; }
        public string? GroupsJson { get; set; }
        public string? ProcessJson { get; set; }
    }
}
