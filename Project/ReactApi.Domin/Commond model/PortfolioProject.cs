using ReactApi.Domin.BaseModel;
using System;

namespace ReactApi.Domin.Commond_model
{
    public class PortfolioProject : BaseDomin
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public string? VideoUrl { get; set; }
        public string? Thumb { get; set; }
        public string? ThumbFull { get; set; }
        public string? Tags { get; set; }
        public int? Views { get; set; }
        public string? ClientName { get; set; }
        public DateTime? ProjectDate { get; set; }
        public string? Duration { get; set; }
        public bool? IsFeatured { get; set; }
        public string? Visibility { get; set; }

        // Project Overview / Details fields
        public string? ProjectType { get; set; }
        public string? Industry { get; set; }
        public string? Skills { get; set; }
        public string? Challenge { get; set; }
        public string? Solution { get; set; }
        public string? Result { get; set; }
        public string? Testimonial { get; set; }
    }
}
