import { useState } from "react";
import PortfolioData from "../../assets/jsonData/portfolio/PortfolioData.json"
import { Link } from "react-router-dom";

interface IsotopeGalleryProps {
    maxItems?: number;
}

const IsotopeGallery = ({ maxItems }: IsotopeGalleryProps) => {

    const [activeFilter, setActiveFilter] = useState("All");

    const categories = [
        "All",
        "Animation & Motion Graphics",
        "Explainer Videos",
        "Video Production & Editing",
        "Product & Commercial Animation",
        "Business & Corporate Media",
        "Design & Branding",
        "Web & App Animation",
        "Logo & Lottie Animation",
        "3D Product Animation",
        "Text Animation",
        "Whiteboard Animation",
        "Infographic Animation"
    ];

    const filterProject = (project: any) => {
        if (activeFilter === "All") return true;
        
        const tags = project.tags.map((t: string) => t.toLowerCase());
        const title = project.title.toLowerCase();
        
        switch (activeFilter) {
            case "Animation & Motion Graphics":
                return tags.includes("animation") || tags.includes("motion") || tags.includes("vfx") || tags.includes("sfx");
            case "Explainer Videos":
                return tags.includes("explainer") || tags.includes("saas") || tags.includes("promo");
            case "Video Production & Editing":
                return tags.includes("video") || tags.includes("editing") || tags.includes("production");
            case "Product & Commercial Animation":
                return tags.includes("product") || tags.includes("commercial") || tags.includes("marketing");
            case "Business & Corporate Media":
                return tags.includes("business") || tags.includes("corporate") || tags.includes("media");
            case "Design & Branding":
                return tags.includes("design") || tags.includes("branding") || tags.includes("visual identity");
            case "Web & App Animation":
                return tags.includes("web") || tags.includes("app") || tags.includes("ui") || tags.includes("ux") || tags.includes("interaction");
            case "Logo & Lottie Animation":
                return tags.includes("logo") || tags.includes("lottie") || tags.includes("json");
            case "3D Product Animation":
                return tags.includes("3d") || tags.includes("blender") || tags.includes("cycles") || title.includes("3d");
            case "Text Animation":
                return tags.includes("typography") || tags.includes("text") || tags.includes("kinetic");
            case "Whiteboard Animation":
                return tags.includes("whiteboard") || tags.includes("hand-drawn");
            case "Infographic Animation":
                return tags.includes("infographic") || tags.includes("data") || tags.includes("statistics");
            default:
                return true;
        }
    };

    const filteredData = PortfolioData.filter(filterProject);
    const displayData = maxItems ? filteredData.slice(0, maxItems) : filteredData;

    return (
        <>
            <div className="portfolio-filter-nav">
                <ul>
                    {categories.map((cat, index) => (
                        <li key={index}>
                            <button 
                                className={activeFilter === cat ? "active" : ""}
                                onClick={() => setActiveFilter(cat)}
                            >
                                {cat}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="modern-portfolio-grid">
                {displayData.map((portfolio: any) => {
                    const isDirectVideo = portfolio.videoUrl?.endsWith('.mp4') || portfolio.videoUrl?.endsWith('.webm') || portfolio.videoUrl?.endsWith('.ts');
                    const isEmbedVideo = portfolio.videoUrl && (portfolio.videoUrl.includes('vimeo.com') || portfolio.videoUrl.includes('youtube.com') || portfolio.videoUrl.includes('youtu.be'));
                    
                    return (
                        <div className="modern-portfolio-card" key={portfolio.id}>
                            <Link to={`/project-details/${portfolio.id}`} style={{ display: 'block' }}>
                                <div className="portfolio-thumb-wrapper" style={{ cursor: 'pointer', position: 'relative' }}>
                                    {isDirectVideo ? (
                                        <video 
                                            src={portfolio.videoUrl} 
                                            autoPlay 
                                            muted 
                                            loop 
                                            playsInline 
                                            preload="metadata"
                                            className="w-100" 
                                            style={{ borderRadius: '10px', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }} 
                                        />
                                    ) : isEmbedVideo ? (
                                        <div style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative' }}>
                                            <iframe
                                                src={`${portfolio.videoUrl}${portfolio.videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1&muted=1&background=1&controls=0`}
                                                style={{ width: '100%', height: '150%', position: 'absolute', top: '-25%', left: 0, border: 'none', pointerEvents: 'none' }}
                                                allow="autoplay; fullscreen"
                                            ></iframe>
                                            {/* Overlay to intercept clicks for navigation */}
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}></div>
                                        </div>
                                    ) : (
                                        <>
                                            <img src={`/assets/img/projects/${portfolio.thumb}`} alt={portfolio.title} />
                                            <div className="portfolio-hover-overlay">
                                                <i className="fas fa-arrow-right play-icon-glow" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Link>
                            <div className="portfolio-details-bottom">
                                <ul className="pf-tags-modern">
                                    {portfolio.tags.map((data: string, index: number) =>
                                        <li key={index} >
                                            <Link to="#" >{data}</Link>
                                        </li>
                                    )}
                                </ul>
                                <h4><Link to={`/project-details/${portfolio.id}`}>{portfolio.title}</Link></h4>
                                {portfolio.description && <p className="portfolio-desc-modern">{portfolio.description}</p>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default IsotopeGallery;