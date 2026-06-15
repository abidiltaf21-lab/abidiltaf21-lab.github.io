using ReactApi.Domin.BaseModel;
using System;

namespace ReactApi.Domin.Commond_model
{
    public class SiteSetting : BaseDomin
    {
        public string? HeroTitle { get; set; }
        public string? HeroSubtitle { get; set; }
        public string? HeroVideoUrl { get; set; }
        public string? CtaText { get; set; }
        public string? CtaLink { get; set; }
        public string? SiteName { get; set; }
        public string? LogoUrl { get; set; }
        public string? SeoDescription { get; set; }
        public string? SocialInstagram { get; set; }
        public string? SocialBehance { get; set; }
        public string? SocialDribbble { get; set; }
        public string? SocialLinkedIn { get; set; }
        public bool GalleryAutoplay { get; set; } = true;
        public double HeroVideoOpacity { get; set; } = 0.5;
        public string? HeroTypedText { get; set; } = "Motion Graphics,2D Animation,Explainer Videos";
        public string? HeroTypedColor { get; set; } = "linear-gradient(90deg, #8b5cf6, #3b82f6)";
    }
}
