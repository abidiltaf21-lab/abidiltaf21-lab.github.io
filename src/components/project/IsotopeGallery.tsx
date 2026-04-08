import PortfolioData from "../../assets/jsonData/portfolio/PortfolioData.json"
import { Link } from "react-router-dom";

interface IsotopeGalleryProps {
    maxItems?: number;
}

const IsotopeGallery = ({ maxItems }: IsotopeGalleryProps) => {

    return (
        <>
            <div className="modern-portfolio-grid">
                {(maxItems ? PortfolioData.slice(0, maxItems) : PortfolioData).map((portfolio: any) => {
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
                )})}
            </div>
        </>
    );
};

export default IsotopeGallery;