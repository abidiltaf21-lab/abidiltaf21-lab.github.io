using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReactApi.Infrastructer.Data
{
    public static class PortfolioDataSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext db)
        {
            // If SiteSettings is already populated, the database has been seeded.
            // Return early to avoid running 8 additional sequential database checks.
            if (await db.SiteSettings.AnyAsync())
            {
                return;
            }

            // 1. Site Settings
            if (!await db.SiteSettings.AnyAsync())
            {
                db.SiteSettings.Add(new SiteSetting
                {
                    HeroTitle = "We Create Smooth Visual Journeys",
                    HeroSubtitle = "Full-service motion graphics, 2D & 3D animation, and explainer video production studio.",
                    HeroVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-shapes-and-grid-41945-large.mp4",
                    CtaText = "Get a Free Quote",
                    CtaLink = "#contact",
                    SiteName = "SmooothPixel",
                    LogoUrl = "/assets/img/logo.png",
                    SeoDescription = "SmooothPixel is a premium creative animation and motion graphics studio by Abidullah Iltaf.",
                    SocialInstagram = "https://instagram.com/smooothpixel",
                    SocialBehance = "https://behance.net/smooothpixel",
                    SocialDribbble = "https://dribbble.com/smooothpixel",
                    SocialLinkedIn = "https://linkedin.com/in/smooothpixel",
                    GalleryAutoplay = true,
                    HeroVideoOpacity = 0.45,
                    HeroTypedText = "Motion Graphics,2D Animation,Explainer Videos,3D Product Animation",
                    HeroTypedColor = "linear-gradient(90deg, #FFAE00, #F54200)"
                });
                await db.SaveChangesAsync();
            }

            // 2. Video Categories
            if (!await db.VideoCategories.AnyAsync())
            {
                var categories = new List<VideoCategory>
                {
                    new() { Name = "Animation & Motion Graphics", Slug = "animation-motion", Description = "Custom 2D/3D animations and motion graphics", IsActive = true, SortOrder = 1 },
                    new() { Name = "Explainer Videos", Slug = "explainers", Description = "SaaS, corporate, and whiteboard explainer videos", IsActive = true, SortOrder = 2 },
                    new() { Name = "Video Production & Editing", Slug = "video-production", Description = "High-quality video editing and post-production", IsActive = true, SortOrder = 3 }
                };
                db.VideoCategories.AddRange(categories);
                await db.SaveChangesAsync();
            }

            // 3. Videos (Showreel)
            if (!await db.Videos.AnyAsync())
            {
                var catAnimation = await db.VideoCategories.FirstOrDefaultAsync(c => c.Slug == "animation-motion");
                var catExplainer = await db.VideoCategories.FirstOrDefaultAsync(c => c.Slug == "explainers");
                var catProduction = await db.VideoCategories.FirstOrDefaultAsync(c => c.Slug == "video-production");

                var videos = new List<Video>
                {
                    new()
                    {
                        Title = "Studio Showreel 2026",
                        Description = "Our official motion design and creative editing reel showcasing projects from 2025-2026.",
                        VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-animation-of-futuristic-shapes-and-grid-41945-large.mp4",
                        Duration = "01:30",
                        IsFeatured = true,
                        Views = 1520,
                        Visibility = "Public",
                        ClientName = "Internal",
                        ProjectDate = DateTime.Now.AddMonths(-1),
                        Tags = "Showreel, Motion Graphics, VFX",
                        CategoryId = catAnimation?.Id
                    },
                    new()
                    {
                        Title = "SaaS Platform Explainer Video",
                        Description = "Character-driven 2D animation explaining database sync products.",
                        VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-3d-render-of-abstract-shapes-48356-large.mp4",
                        Duration = "00:45",
                        IsFeatured = false,
                        Views = 840,
                        Visibility = "Public",
                        ClientName = "Syncly Inc.",
                        ProjectDate = DateTime.Now.AddMonths(-2),
                        Tags = "Explainer, 2D Animation",
                        CategoryId = catExplainer?.Id
                    },
                    new()
                    {
                        Title = "3D Product Animation",
                        Description = "High-end product visual simulation and cinematic product reveal.",
                        VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-modern-3d-render-48366-large.mp4",
                        Duration = "01:15",
                        IsFeatured = false,
                        Views = 910,
                        Visibility = "Public",
                        ClientName = "Aura Corp",
                        ProjectDate = DateTime.Now.AddMonths(-3),
                        Tags = "3D Design, Simulation",
                        CategoryId = catAnimation?.Id
                    }
                };
                db.Videos.AddRange(videos);
                await db.SaveChangesAsync();
            }

            // 4. Portfolio Projects
            if (!await db.PortfolioProjects.AnyAsync())
            {
                var projects = new List<PortfolioProject>
                {
                    new()
                    {
                        Title = "SaaS Platform Explainer",
                        Description = "An engaging character-driven explainer video showcasing features of a modern cloud analytics platform.",
                        VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-3d-render-of-abstract-shapes-48356-large.mp4",
                        Thumb = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
                        ThumbFull = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                        Tags = "Animation & Motion Graphics, Explainer Videos",
                        Views = 450,
                        ClientName = "Syncly Inc.",
                        ProjectDate = DateTime.Now.AddMonths(-2),
                        Duration = "0:45",
                        IsFeatured = true,
                        Visibility = "public",
                        ProjectType = "2D Animation",
                        Industry = "Technology / SaaS",
                        Skills = "Illustrator, After Effects",
                        Challenge = "Explain complex real-time database sync logic in less than 60 seconds.",
                        Solution = "Created a clear visual metaphor of 'data pipelines' represented as bright colorful water streams.",
                        Result = "Led to a 25% increase in user registrations from the landing page.",
                        Testimonial = "The video perfectly captured what we do in an elegant and easy-to-understand way. Amazing work!"
                    },
                    new()
                    {
                        Title = "3D Product Animation",
                        Description = "Photorealistic 3D product simulation and visual rendering.",
                        VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-modern-3d-render-48366-large.mp4",
                        Thumb = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
                        ThumbFull = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
                        Tags = "Animation & Motion Graphics, 3D Product Animation",
                        Views = 620,
                        ClientName = "Aura Corp",
                        ProjectDate = DateTime.Now.AddMonths(-3),
                        Duration = "1:15",
                        IsFeatured = true,
                        Visibility = "public",
                        ProjectType = "3D Animation / VFX",
                        Industry = "Tech Hardware",
                        Skills = "Blender, Cinema 4D, Octane",
                        Challenge = "Reveal details of the new smartphone concept without showing engineering drawings.",
                        Solution = "Used clean, cinematic lighting sweeps and micro-particle flows to outline the model.",
                        Result = "Achieved 100k views on social media pre-launch channels.",
                        Testimonial = "Exactly the premium and futuristic look we wanted for our brand. Incredibly talented team."
                    }
                };
                db.PortfolioProjects.AddRange(projects);
                await db.SaveChangesAsync();
            }

            // 5. Services
            if (!await db.Services.AnyAsync())
            {
                var services = new List<Service>
                {
                    new()
                    {
                        Title = "2D Animation & Motion Graphics",
                        Text = "Engaging vector characters, typography, and visual transitions that explain your product or service clearly.",
                        Icon = "flaticon-video-camera",
                        VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-3d-render-of-abstract-shapes-48356-large.mp4",
                        DisplayOrder = 1,
                        IsActive = true,
                        Price = 1200,
                        FeaturesJson = "[\"Custom Storyboarding\",\"Vector Illustration\",\"Professional Voiceover\",\"Sound Design & SFX\",\"Full HD Resolution\"]",
                        MainTitle = "High-Quality 2D Animated Videos",
                        Description = "Perfect for SaaS platforms, startups, and marketing campaigns.",
                        SecondaryDescription = "Our custom character and infographic designs make your message unforgettable.",
                        GroupsJson = "[]",
                        ProcessJson = "[]"
                    },
                    new()
                    {
                        Title = "3D Animation & Rendering",
                        Text = "Photorealistic modeling, lighting, and dynamic camera movements to show off products from every angle.",
                        Icon = "flaticon-3d",
                        VideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-modern-3d-render-48366-large.mp4",
                        DisplayOrder = 2,
                        IsActive = true,
                        Price = 2200,
                        FeaturesJson = "[\"C4D/Blender Modeling\",\"Realistic Materials & Lighting\",\"Fluid/Dynamic Simulations\",\"4K Ultra HD Rendering\",\"Commercial Use License\"]",
                        MainTitle = "Cinematic 3D Product Promos",
                        Description = "Elevate your product launch with state-of-the-art 3D animations.",
                        SecondaryDescription = "Ideal for hardware concepts, electronics, packaging, and advertising.",
                        GroupsJson = "[]",
                        ProcessJson = "[]"
                    }
                };
                db.Services.AddRange(services);
                await db.SaveChangesAsync();
            }

            // 6. Team Members
            if (!await db.TeamMembers.AnyAsync())
            {
                var team = new List<TeamMember>
                {
                    new()
                    {
                        Name = "Abidullah Iltaf",
                        Role = "Creative Director & Lead Animator",
                        Bio = "Over 10 years of visual effects, character design, and 3D modeling experience.",
                        Image = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
                        Skills = "Cinema 4D, After Effects, Creative Strategy, Editing",
                        SortOrder = 1,
                        IsActive = true
                    }
                };
                db.TeamMembers.AddRange(team);
                await db.SaveChangesAsync();
            }

            // 7. Reviews
            if (!await db.Reviews.AnyAsync())
            {
                var reviews = new List<Review>
                {
                    new()
                    {
                        Author = "Sarah Jenkins",
                        Text = "Abidullah and team transformed our complicated dashboard sync feature into a gorgeous 45-second explainer video. Conversions are up 25%!",
                        Rating = 5,
                        Project = "SaaS Platform Explainer",
                        Company = "Syncly Inc.",
                        Website = "syncly.io",
                        Status = "approved",
                        IsApproved = true
                    },
                    new()
                    {
                        Author = "Michael Torres",
                        Text = "The photorealistic 3D product animations exceeded all expectations. Fast communication, premium quality, and punctual delivery.",
                        Rating = 5,
                        Project = "3D Product Animation",
                        Company = "Aura Corp",
                        Website = "auracorp.co",
                        Status = "approved",
                        IsApproved = true
                    }
                };
                db.Reviews.AddRange(reviews);
                await db.SaveChangesAsync();
            }

            // 8. Pricing System
            if (!await db.Pricings.AnyAsync())
            {
                db.Pricings.Add(new Pricing
                {
                    BaseRate = 45,
                    ComplexityBasic = 1.0m,
                    ComplexityMedium = 1.5m,
                    ComplexityHigh = 2.2m,
                    RateMotion = 100,
                    RateExplainer = 150,
                    RateProduction = 120,
                    RateThreeD = 200,
                    DeliveryDaysBasic = 2,
                    DeliveryDaysMedium = 4,
                    DeliveryDaysHigh = 7,
                    UrgentMultiplier = 0.7m
                });
                await db.SaveChangesAsync();
            }

            // 9. Social Accounts
            if (!await db.SocialAccounts.AnyAsync())
            {
                var social = new List<SocialAccount>
                {
                    new() { Platform = "Instagram", Value = "@smooothpixel", Icon = "fab fa-instagram", Link = "https://instagram.com/smooothpixel", IsVisible = true, SortOrder = 1 },
                    new() { Platform = "Behance", Value = "smooothpixel", Icon = "fab fa-behance", Link = "https://behance.net/smooothpixel", IsVisible = true, SortOrder = 2 },
                    new() { Platform = "Dribbble", Value = "smooothpixel", Icon = "fab fa-dribbble", Link = "https://dribbble.com/smooothpixel", IsVisible = true, SortOrder = 3 }
                };
                db.SocialAccounts.AddRange(social);
                await db.SaveChangesAsync();
            }
        }
    }
}
