import { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useSettings } from "../../hooks/useSettings";
import { Link } from "react-router-dom";
import { useCategories } from "../../hooks/useCategories";
import { useLanguage } from "../../context/LanguageContext";

interface IsotopeGalleryProps {
    maxItems?: number;
}

const IsotopeGallery = ({ maxItems }: IsotopeGalleryProps) => {

    const [activeFilter, setActiveFilter] = useState("All");
        const { t } = useLanguage();
    const { projects, loading, error } = useProjects();
    const { categories: backendCategories, loading: catLoading } = useCategories();
    const { settings } = useSettings();

    // Enable/Disable Autoplay based on global settings (defaults to true)
    const canAutoplay = settings?.galleryAutoplay ?? true;

    // Generate dynamic categories from backend
    const dynamicCategoryNames = backendCategories.map((c: any) => c.name || c.Name);
    const categories = ["All", ...dynamicCategoryNames];

    const isVideoUrl = (url: string) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg|mov|ts)(\?.*)?$/i) || (url.includes('cloudinary.com') && (url.includes('/video/') || url.includes('/auto/')));
    };

    const filterProject = (project: any) => {
        if (activeFilter === "All") return true;
        
        const rawTags = Array.isArray(project.tags) ? project.tags : 
                        (project.Tags ? (typeof project.Tags === 'string' ? project.Tags.split(',') : []) : 
                        (project.tags ? (typeof project.tags === 'string' ? project.tags.split(',') : []) : []));
        
        const tags = rawTags.map((t: string) => t.trim().toLowerCase());
        const title = (project.title || project.Title || "").toLowerCase();
        
        // 1. ADVANCED EXACT MATCH: If the admin selected the exact category from the form
        if (tags.includes(activeFilter.toLowerCase())) {
            return true;
        }
        
        // 2. ADVANCED FUZZY MATCH: Fallback for older projects or loosely tagged projects
        const hasKeyword = (keywords: string[]) => {
            return keywords.some(kw => tags.some(t => t.includes(kw)) || title.includes(kw));
        };
        
        switch (activeFilter) {
            case "Animation & Motion Graphics":
                return hasKeyword(["animation", "motion", "vfx", "sfx"]);
            case "Explainer Videos":
                return hasKeyword(["explainer", "saas", "promo"]);
            case "Video Production & Editing":
                return hasKeyword(["video", "editing", "production", "edit"]);
            case "Product & Commercial Animation":
                return hasKeyword(["product", "commercial", "marketing", "ad"]);
            case "Business & Corporate Media":
                return hasKeyword(["business", "corporate", "media", "company"]);
            case "Design & Branding":
                return hasKeyword(["design", "branding", "visual", "identity"]);
            case "Web & App Animation":
                return hasKeyword(["web", "app", "ui", "ux", "interaction"]);
            case "Logo & Lottie Animation":
                return hasKeyword(["logo", "lottie", "json", "svg"]);
            case "3D Product Animation":
                return hasKeyword(["3d", "blender", "cycles", "cinema4d"]);
            case "Text Animation":
                return hasKeyword(["typography", "text", "kinetic", "title"]);
            case "Whiteboard Animation":
                return hasKeyword(["whiteboard", "hand-drawn", "doodle"]);
            case "Infographic Animation":
                return hasKeyword(["infographic", "data", "statistics", "chart"]);
            default:
                // For custom dynamic categories, exact match is already checked above.
                return false;
        }
    };

    if (loading) return <div className="p-50 text-center">Loading Projects...</div>;
    if (error) return <div className="p-50 text-center text-danger">Error: {error}</div>;

    const filteredData = projects.filter(filterProject);
    const displayData = maxItems ? filteredData.slice(0, maxItems) : filteredData;

        const getCategoryLabel = (cat: string) => {
        if (cat === "All") return t('all');
        if (cat === "Animation & Motion Graphics" || cat === "Animation & Motion") return t('animation_motion');
        if (cat === "Explainer Videos" || cat === "SaaS & Explainers") return t('saas_explainers');
        if (cat === "Video Production & Editing" || cat === "Video Production") return t('video_production');
        return cat;
    };

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
                                {getCategoryLabel(cat)}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="modern-portfolio-grid">
                {displayData.map((portfolio: any) => {
                    // Aggressive normalization for .NET PascalCase and camelCase
                    const pid = portfolio.id || portfolio.Id || portfolio.ID || portfolio._id;
                    const title = portfolio.title || portfolio.Title || "Untitled";
                    // Normalize video URLs (Force .mp4 for Cloudinary .ts files to fix playback/download issues)
                    let videoUrl = portfolio.videoUrl || portfolio.VideoUrl || "";
                    if (videoUrl.includes('cloudinary.com') && videoUrl.toLowerCase().endsWith('.ts')) {
                        videoUrl = videoUrl.replace(/\.ts$/i, '.mp4');
                    }

                    const thumb = portfolio.thumb || portfolio.Thumb || "";
                    const tags = Array.isArray(portfolio.tags) ? portfolio.tags : 
                                (portfolio.Tags ? (typeof portfolio.Tags === 'string' ? portfolio.Tags.split(',') : []) : 
                                (portfolio.tags ? (typeof portfolio.tags === 'string' ? portfolio.tags.split(',') : []) : []));

                    const isDirectVideo = isVideoUrl(videoUrl);
                    const isEmbedVideo = !isDirectVideo && videoUrl && (videoUrl.includes('vimeo.com') || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));
                    
                        const getCategoryLabel = (cat: string) => {
        if (cat === "All") return t('all');
        if (cat === "Animation & Motion Graphics" || cat === "Animation & Motion") return t('animation_motion');
        if (cat === "Explainer Videos" || cat === "SaaS & Explainers") return t('saas_explainers');
        if (cat === "Video Production & Editing" || cat === "Video Production") return t('video_production');
        return cat;
    };

    return (
                        <div className="modern-portfolio-card sp-card" key={pid}>
                            <Link to={`/project-details/${pid}`} style={{ display: 'block' }}>
                                <div className="portfolio-thumb-wrapper" style={{ cursor: 'pointer', position: 'relative' }}>
                                    {isDirectVideo ? (
                                        <video 
                                            src={videoUrl} 
                                            autoPlay={canAutoplay} 
                                            muted 
                                            loop 
                                            playsInline 
                                            preload="metadata"
                                            poster={thumb && thumb.startsWith('http') ? thumb : (thumb && thumb.length > 2 ? `/assets/img/projects/${thumb}` : undefined)}
                                            className="w-100" 
                                            style={{ borderRadius: '10px', display: 'block', aspectRatio: '16/9', objectFit: 'cover' }}
                                            onMouseOver={(e) => canAutoplay && (e.target as HTMLVideoElement).play()}
                                            onMouseOut={(e) => !canAutoplay && (e.target as HTMLVideoElement).pause()}
                                        />
                                    ) : isEmbedVideo ? (
                                        <div style={{ borderRadius: '10px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', background: '#000' }}>
                                            <iframe
                                                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1&muted=1&background=1&controls=0`}
                                                style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: 0, border: 'none', pointerEvents: 'none', objectFit: 'cover' }}
                                                allow="autoplay; fullscreen"
                                            ></iframe>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}></div>
                                        </div>
                                    ) : (
                                        <>
                                            <img 
                                                src={thumb && thumb.startsWith('http') ? thumb : (thumb && thumb.length > 2 ? `/assets/img/projects/${thumb}` : 'https://placehold.co/600x400/0f172a/FFF?text=Preview+Unavailable')} 
                                                alt={title} 
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/0f172a/FFF?text=Image+Load+Error';
                                                }}
                                            />
                                            <div className="portfolio-hover-overlay">
                                                <i className="fas fa-arrow-right play-icon-glow" />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Link>
                            <div className="portfolio-details-bottom">
                                <ul className="pf-tags-modern">
                                    {tags.map((tag: any, index: number) =>
                                        <li key={index} >
                                            <Link to="#" >{String(tag).trim()}</Link>
                                        </li>
                                    )}
                                </ul>
                                <h4><Link to={`/project-details/${pid}`}>{title}</Link></h4>
                                {(portfolio.description || portfolio.Description) && <p className="portfolio-desc-modern">{portfolio.description || portfolio.Description}</p>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default IsotopeGallery;