using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApi.Domin.Commond_model;
using ReactApi.Infrastructer.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ServicesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Services
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.OrderBy(s => s.DisplayOrder).ToListAsync();
        }

        // GET: api/Services/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Service>> GetService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        // POST: api/Services
        [HttpPost]
        public async Task<ActionResult<Service>> PostService(Service service)
        {
            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetService), new { id = service.Id }, service);
        }

        // PUT: api/Services/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutService(int id, Service service)
        {
            if (id != service.Id)
            {
                return BadRequest();
            }

            _context.Entry(service).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Services/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Services/seed
        [HttpPost("seed")]
        public async Task<IActionResult> SeedServices()
        {
            // Clear existing services to ensure a clean updated slate
            var existing = await _context.Services.ToListAsync();
            if (existing.Any())
            {
                _context.Services.RemoveRange(existing);
                await _context.SaveChangesAsync();
            }

            var defaultServices = new List<Service>
            {
                new Service 
                { 
                    Title = "Animation & Motion", 
                    Icon = "fas fa-film", 
                    Text = "Fluid Storytelling and Cinematic Visuals", 
                    DisplayOrder = 1,
                    Price = 149,
                    FeaturesJson = "[\"Custom 2D Animation\",\"Corporate Motion Graphics\",\"UI & Social Media Motion\",\"3D & Particle Logo Reveal\",\"Animated Typo & Kinetic Text\",\"Character Rigging & Setup\"]",
                    MainTitle = "Premium Animation & Motion Graphic Solutions",
                    Description = "High-end cinematic animation that brings stories to life. From character-driven 2D to advanced motion graphics, we provide industry-leading visual solutions.",
                    SecondaryDescription = "Our team specializes in creating fluid, high-impact motion content that elevates brand narratives across all digital platforms.",
                    GroupsJson = "[{\"name\":\"2D Animation\",\"items\":[\"Custom 2D Animation\",\"Frame-by-frame Animation\",\"Cut-out Animation\",\"Rigging & Character Setup\",\"Animated GIFs\",\"Text Animation\",\"Lottie & Web Animation\"]},{\"name\":\"Motion Graphics\",\"items\":[\"Corporate Motion Graphics\",\"UI Motion Graphics\",\"Social Media Motion Graphics\",\"Animated Typography\",\"Kinetic Text Videos\"]},{\"name\":\"Logo Animation\",\"items\":[\"Minimal Logo Animation\",\"3D Logo Reveal\",\"Particle Logo Animation\",\"Intro Logo Animation\",\"Outro Logo Animation\"]}]",
                    ProcessJson = "[{\"title\":\"Concept & Storyboard\",\"text\":\"Mapping out the visual journey.\"},{\"title\":\"Illustration & Rigging\",\"text\":\"Creating custom assets and setups.\"},{\"title\":\"Motion Design\",\"text\":\"Bringing the story to life with animation.\"}]"
                },
                new Service 
                { 
                    Title = "Explainer Videos", 
                    Icon = "fas fa-lightbulb", 
                    Text = "Communicate Your Message with Clarity", 
                    DisplayOrder = 2,
                    Price = 299,
                    FeaturesJson = "[\"SaaS & Startup Explainers\",\"Icon-Based & Flat Design\",\"Character-Based Storytelling\",\"Infographic & Data Videos\",\"Whiteboard & Hand-Drawn\",\"Product & App Demos\"]",
                    MainTitle = "High-Converting Professional Explainer Videos",
                    Description = "Simplifying complex products and services into engaging, high-retention video content. We cover a vast range of styles to fit your brand identity.",
                    SecondaryDescription = "Our explainer videos are designed to educate, inspire, and convert, tailored specifically for startups, SaaS, and corporate entities.",
                    GroupsJson = "[{\"name\":\"Professional Styles\",\"items\":[\"Linear Explainer\",\"Icon-Based Explainer\",\"Flat Explainer\",\"Character-Based Explainer\",\"Infographic Explainer\",\"Whiteboard Explainer\",\"SaaS Explainer\",\"Startup Explainer\",\"Product Explainer\",\"App Explainer\",\"Corporate Explainer\",\"Medical Explainer\",\"Educational Explainer\",\"Parallax Explainer\",\"Isometric Explainer\"]}]",
                    ProcessJson = "[{\"title\":\"Strategy & Scripting\",\"text\":\"Defining the core message.\"},{\"title\":\"Visual Development\",\"text\":\"Defining the style and assets.\"},{\"title\":\"Production\",\"text\":\"Final high-end rendering.\"}]"
                },
                new Service 
                { 
                    Title = "Video Production", 
                    Icon = "fas fa-video", 
                    Text = "Professional Editing & Cinematic Ads", 
                    DisplayOrder = 3,
                    Price = 199,
                    FeaturesJson = "[\"Advanced Post-Production\",\"Social Media Ads & Promo\",\"Corporate Video Production\",\"E-Commerce & Shopify Ads\",\"Professional Color Grading\",\"Subtitles & High-End Edits\"]",
                    MainTitle = "Cinematic Video Production & Post-Production",
                    Description = "Transforming raw footage into professional masterpieces. We handle everything from corporate documentaries to fast-paced social ads.",
                    SecondaryDescription = "Advanced editing, color grading, and sound design to ensure your video content stands out with a premium cinematic feel.",
                    GroupsJson = "[{\"name\":\"Post-Production Services\",\"items\":[\"Video Editing\",\"Corporate Videos\",\"Social Media Videos\",\"Slideshow Videos\",\"Intro & Outro Videos\",\"Subtitles & Captions\",\"Video Ads & Commercials\",\"Real Estate Promos\",\"App & Website Previews\",\"E-Commerce Product Videos\"]}]",
                    ProcessJson = "[{\"title\":\"Culling & Selection\",\"text\":\"Choosing the best takes.\"},{\"title\":\"Editing & Flow\",\"text\":\"Building the narrative rhythm.\"},{\"title\":\"VFX & Grading\",\"text\":\"Final polish and color.\"}]"
                },
                new Service 
                { 
                    Title = "3D Product Animation", 
                    Icon = "fas fa-cube", 
                    Text = "Photorealistic 3D Renders & Promos", 
                    DisplayOrder = 4,
                    Price = 499,
                    FeaturesJson = "[\"Full 3D Product Animation\",\"E-Commerce 3D Product Ad\",\"Amazon / Shopify Showcase\",\"Realistic Texture & Lighting\",\"Exploded View Animations\",\"High-Fidelity 4K Renders\"]",
                    MainTitle = "Advanced Product & Commercial Visualization",
                    Description = "Photorealistic 3D and 2D animations that showcase your product's features and benefits with stunning detail.",
                    SecondaryDescription = "Perfect for E-Commerce, Amazon, and luxury brands looking for high-fidelity visual representations.",
                    GroupsJson = "[{\"name\":\"Product Animation\",\"items\":[\"3D Product Animation\",\"2D Product Animation\",\"E-Commerce Product Promo\",\"Amazon / Shopify Product Videos\",\"Product Demo Videos\",\"Unboxing Style Animation\"]}]",
                    ProcessJson = "[{\"title\":\"Modeling & Texturing\",\"text\":\"Creating realistic 3D assets.\"},{\"title\":\"Lighting & Rendering\",\"text\":\"Setting the cinematic mood.\"},{\"title\":\"Motion & Camera\",\"text\":\"Dynamic angles and reveals.\"}]"
                },
                new Service 
                { 
                    Title = "Business Media", 
                    Icon = "fas fa-briefcase", 
                    Text = "Authority & Branding for Corporations", 
                    DisplayOrder = 5,
                    Price = 399,
                    FeaturesJson = "[\"Company Profile Films\",\"Internal Training Media\",\"Investor Pitch Videos\",\"Event Promo & Highlights\",\"Corporate Branding Content\",\"Professional Interview Edits\"]",
                    MainTitle = "High-Authority Business & Corporate Media",
                    Description = "Enhancing corporate communication through professional branding films, training videos, and pitch media.",
                    SecondaryDescription = "We create high-impact media that builds trust and authority for established companies and growing businesses alike.",
                    GroupsJson = "[{\"name\":\"Corporate Media\",\"items\":[\"Company Profile Videos\",\"Internal Training Videos\",\"Corporate Branding Videos\",\"Investor Pitch Videos\",\"Event Promo Videos\"]}]",
                    ProcessJson = "[{\"title\":\"Stakeholder Strategy\",\"text\":\"Aligning with brand goals.\"},{\"title\":\"Production Planning\",\"text\":\"Efficient and high-quality filming/edit.\"},{\"title\":\"Final Delivery\",\"text\":\"On-brand and ready for broadcast.\"}]"
                },
                new Service 
                { 
                    Title = "Design & Branding", 
                    Icon = "fas fa-palette", 
                    Text = "Strategic Identity & Creative Design", 
                    DisplayOrder = 6,
                    Price = 249,
                    FeaturesJson = "[\"Custom Logo Design\",\"Complete Brand Identity\",\"Social Media Branding Kit\",\"Animated Brand Assets\",\"Strategic Design Thinking\",\"Print-Ready Brand Guides\"]",
                    MainTitle = "Strategic Brand Identity & Creative Design",
                    Description = "Crafting timeless visual identities that define your brand's future. From minimalist logos to complete brand kits.",
                    SecondaryDescription = "Strategic design thinking that ensures your brand is memorable, unique, and consistently represented.",
                    GroupsJson = "[{\"name\":\"Branding & Design\",\"items\":[\"Logo Design\",\"Brand Identity Design\",\"Social Media Branding Kits\",\"Animated Brand Kits\"]}]",
                    ProcessJson = "[{\"title\":\"Research & Discovery\",\"text\":\"Understanding the market.\"},{\"title\":\"Conceptual Design\",\"text\":\"Drafting multiple directions.\"},{\"title\":\"Final Polish\",\"text\":\"Finalizing the identity system.\"}]"
                },
                new Service 
                { 
                    Title = "Web & App Motion", 
                    Icon = "fas fa-mobile-alt", 
                    Text = "Interactive UI & Lottie Animation", 
                    DisplayOrder = 7,
                    Price = 349,
                    FeaturesJson = "[\"Web Micro-Animations\",\"Lottie For Web & Mobile\",\"App Interface Animation\",\"SaaS Dashboard Motion\",\"High-Performance SVG Renders\",\"Interactive UI Flow Design\"]",
                    MainTitle = "Interactive UX-Driven Interface Animation",
                    Description = "Interactive motion design that brings digital products to life. High-performance Lottie animations and UI micro-interactions.",
                    SecondaryDescription = "Improving user engagement and software feel with smooth, intuitive transitions and interface motion.",
                    GroupsJson = "[{\"name\":\"UI & Interface Motion\",\"items\":[\"Lottie Animation\",\"Web Micro Animations\",\"App UI Animation\",\"Landing Page Animation\",\"SaaS Dashboard Animation\"]}]",
                    ProcessJson = "[{\"title\":\"UI Flow Analysis\",\"text\":\"Mapping key interactions.\"},{\"title\":\"Animation Design\",\"text\":\"Prototyping fluid motion.\"},{\"title\":\"Lottie Export\",\"text\":\"Dev-ready high-performance files.\"}]"
                },
                new Service 
                { 
                    Title = "Logo & Lottie Animation", 
                    Icon = "fas fa-magic", 
                    Text = "Stunning animated logo reveals and high-performance Lottie animations for web and apps.", 
                    DisplayOrder = 8,
                    Price = 129,
                    FeaturesJson = "[\"Minimalist 2D Logo Reveal\",\"3D Logo Reveal\",\"Lottie Web Animation\",\"Mobile App Lottie Icons\",\"VFX & Sound Design\"]",
                    MainTitle = "High-Impact Logo & Lottie Animation Solutions",
                    Description = "Bring your brand identity to life with cinematic logo glows and high-performance Lottie animations. We specialize in creating memorable first impressions for web and mobile.",
                    SecondaryDescription = "From minimalist 2D reveals to dev-ready Lottie files, we ensure your motion assets are lightweight, scalable, and stunning.",
                    GroupsJson = "[{\"name\":\"Service Styles\",\"items\":[\"Minimalist 2D Logo Reveal\",\"3D Logo Reveal\",\"Lottie Web Animation\",\"Mobile App Lottie Icons\",\"Particle & VFX Animation\",\"Glitch & Tech Reveal\",\"Character-Based Reveal\"]}]",
                    ProcessJson = "[{\"title\":\"Vector Preparation\",\"text\":\"Deconstructing your logo for animation.\"},{\"title\":\"Motion Concept\",\"text\":\"Defining the rhythm and style.\"},{\"title\":\"VFX & Sound\",\"text\":\"Final polish with visual and audio effects.\"}]"
                },
                new Service 
                { 
                    Title = "3D Rendering Solutions", 
                    Icon = "fas fa-box-open", 
                    Text = "High-quality 3D animations showcasing your products in realistic environments.", 
                    DisplayOrder = 9,
                    Price = 599,
                    FeaturesJson = "[\"3D Modeling & Materials\",\"Lighting & Textures\",\"Camera Animation\",\"VFX & Editing\",\"Ultra 4K Rendering\"]",
                    MainTitle = "Photorealistic 3D Product Visualization & Animation",
                    Description = "Showcase your product's features and design with high-fidelity 3D animations. We create stunning visuals that highlight every detail.",
                    SecondaryDescription = "Perfect for tech gadgets, luxury goods, and industrial equipment where precision and realism are paramount.",
                    GroupsJson = "[{\"name\":\"3D Services\",\"items\":[\"Product Exploded Views\",\"Cinematic Product Promos\",\"Industrial Visualization\",\"Medical Device Animation\",\"E-commerce 360 Animation\"]}]",
                    ProcessJson = "[{\"title\":\"3D Modeling\",\"text\":\"Creating a precise digital twin.\"},{\"title\":\"Lighting & Materials\",\"text\":\"Adding photorealistic textures.\"},{\"title\":\"Cinematic Motion\",\"text\":\"Capturing the product from dynamic angles.\"}]"
                },
                new Service 
                { 
                    Title = "Kinetic Typography", 
                    Icon = "fas fa-font", 
                    Text = "Kinetic typography and engaging text animations that highlight your message.", 
                    DisplayOrder = 10,
                    Price = 99,
                    FeaturesJson = "[\"Kinetic Typography\",\"Lyric Videos\",\"Corporate Presentation Titles\",\"Social Media Quote Graphics\",\"Creative Title Design\"]",
                    MainTitle = "Dynamic Kinetic Typography & Text Animation",
                    Description = "Transforming static text into engaging visual messages. We use kinetic typography to communicate your story with impact.",
                    SecondaryDescription = "Our text animations are designed for high readability and engagement across social media and corporate presentations.",
                    GroupsJson = "[{\"name\":\"Typography Styles\",\"items\":[\"Kinetic Typography\",\"Lyric Videos\",\"Social Media Quote/Text Animation\",\"Corporate Presentation Titles\",\"Animated Infographic Text\"]}]",
                    ProcessJson = "[{\"title\":\"Script & Rhythm\",\"text\":\"Aligning text with timing and message.\"},{\"title\":\"Design & Layout\",\"text\":\"Choosing fonts that match your brand.\"},{\"title\":\"Motion Keyframing\",\"text\":\"Adding dynamic energy to every word.\"}]"
                },
                new Service 
                { 
                    Title = "Whiteboard Animation Services", 
                    Icon = "fas fa-pencil-alt", 
                    Text = "Engaging hand-drawn whiteboard animations to simplify and explain your ideas.", 
                    DisplayOrder = 11,
                    Price = 179,
                    FeaturesJson = "[\"Classic Whiteboard Sketch\",\"Custom Illustrations\",\"Voiceover Synchronization\",\"Scriptwriting & Storyboard\",\"Colorized Sketch FX\"]",
                    MainTitle = "Engaging & Educational Whiteboard Animation",
                    Description = "Simplify complex ideas with the power of hand-drawn whiteboard animation. We create visual stories that educate and inspire your audience.",
                    SecondaryDescription = "Perfect for training videos, educational content, and product explainers that need a personal touch.",
                    GroupsJson = "[{\"name\":\"Service Styles\",\"items\":[\"Classic Whiteboard Sketch\",\"Full-Color Whiteboard Animation\",\"Hybrid 2D & Whiteboard\",\"Custom Hand-Drawn Illustrations\",\"Educational Storytelling\"]}]",
                    ProcessJson = "[{\"title\":\"Script & Storyboard\",\"text\":\"Outlining the visual and narrative flow.\"},{\"title\":\"Illustration\",\"text\":\"Creating custom hand-drawn assets.\"},{\"title\":\"Animation\",\"text\":\"Syncing the sketches with voiceover.\"}]"
                },
                new Service 
                { 
                    Title = "Infographic Animation Services", 
                    Icon = "fas fa-chart-line", 
                    Text = "Transforming complex data and statistics into engaging animated infographics.", 
                    DisplayOrder = 12,
                    Price = 219,
                    FeaturesJson = "[\"Data Visualization\",\"Animated Charts & Graphs\",\"Process Flow Animation\",\"Timeline Transitions\",\"Corporate Report Polish\"]",
                    MainTitle = "Data-Driven Animated Infographics",
                    Description = "Visualize your data with impact. We transform complex statistics and information into engaging, easy-to-understand animated infographics.",
                    SecondaryDescription = "Perfect for corporate reports, educational presentations, and data-heavy marketing campaigns.",
                    GroupsJson = "[{\"name\":\"Infographic Styles\",\"items\":[\"Data Visualization Animation\",\"Statistical Motion Graphics\",\"Timeline Animation\",\"Process Flow Animation\",\"Interactive Data Charts\"]}]",
                    ProcessJson = "[{\"title\":\"Data Analysis\",\"text\":\"Simplifying the core information.\"},{\"title\":\"Visual Storyboarding\",\"text\":\"Planning the flow of data.\"},{\"title\":\"Motion Design\",\"text\":\"Animating numbers and graphics.\"}]"
                }
            };

            _context.Services.AddRange(defaultServices);
            await _context.SaveChangesAsync();

            return Ok("Services seeded successfully.");
        }

        private bool ServiceExists(int id)
        {
            return _context.Services.Any(e => e.Id == id);
        }
    }
}
