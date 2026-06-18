using ReactApi.Domin.BaseModel;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReactApi.Domin.Commond_model
{
    public class Video : BaseDomin
    {
        [Required]
        [MaxLength(200)]
        public required string Title { get; set; }
        
        public string? Description { get; set; }
        
        [Required]
        [Url]
        [MaxLength(500)]
        public required string VideoUrl { get; set; }
        
        [MaxLength(500)]
        public string? Thumb { get; set; }
        
        [MaxLength(500)]
        public string? ThumbFull { get; set; }
        
        [MaxLength(50)]
        public string? Duration { get; set; }
        
        public bool IsFeatured { get; set; } = false;
        
        public int Views { get; set; } = 0;
        
        [MaxLength(50)]
        public string Visibility { get; set; } = "Public"; // Public, Private
        
        [MaxLength(200)]
        public string? ClientName { get; set; }
        
        public DateTime? ProjectDate { get; set; }
        
        [MaxLength(500)]
        public string? Tags { get; set; }

        // Foreign Key to Category
        public int? CategoryId { get; set; }
        
        [ForeignKey("CategoryId")]
        public virtual VideoCategory? Category { get; set; }
    }
}
