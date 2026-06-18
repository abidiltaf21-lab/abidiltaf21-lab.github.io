using ReactApi.Domin.BaseModel;
using System.ComponentModel.DataAnnotations;

namespace ReactApi.Domin.Commond_model
{
    public class VideoCategory : BaseDomin
    {
        [Required]
        [MaxLength(200)]
        public required string Name { get; set; }
        
        [MaxLength(200)]
        public string? Slug { get; set; }
        
        [MaxLength(1000)]
        public string? Description { get; set; }
        
        [MaxLength(100)]
        public string? ServiceType { get; set; } // e.g., Animation, Explainer, 3D
        
        public bool IsActive { get; set; } = true;
        
        public int SortOrder { get; set; } = 0;
    }
}
