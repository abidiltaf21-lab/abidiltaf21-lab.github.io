import { useState } from 'react';
import PortfolioData from "../../assets/jsonData/portfolio/PortfolioData.json"
import { Link } from "react-router-dom";
import ModalVideo from 'react-modal-video';

const IsotopeGallery = () => {

    const [isOpen, setOpen] = useState(false);
    const [videoId, setVideoId] = useState("");
    const [channel, setChannel] = useState<any>('youtube');

    const openVideo = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        
        // Detect Vimeo
        if (url.includes('vimeo.com')) {
            const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
            if (vimeoMatch && vimeoMatch[1]) {
                setVideoId(vimeoMatch[1]);
                setChannel('vimeo');
                setOpen(true);
            }
            return;
        }

        // Detect YouTube
        const ytMatch = url.match(/(?:\/embed\/|v=|\/watch\?v=|youtu\.be\/)([^?&]+)/);
        if (ytMatch && ytMatch[1]) {
            setVideoId(ytMatch[1]);
            setChannel('youtube');
            setOpen(true);
        }
    };

    return (
        <>
            <ModalVideo channel={channel} isOpen={isOpen} videoId={videoId} onClose={() => setOpen(false)} />
            <div className="modern-portfolio-grid">
                {PortfolioData.map((portfolio: any) => (
                    <div className="modern-portfolio-card" key={portfolio.id}>
                        <div className="portfolio-thumb-wrapper" onClick={(e) => openVideo(e, portfolio.videoUrl || "aqz-KE-bpKQ")}>
                            <img src={`/assets/img/projects/${portfolio.thumb}`} alt={portfolio.title} />
                            <div className="portfolio-hover-overlay">
                                <i className="fas fa-play play-icon-glow" />
                            </div>
                        </div>
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
                ))}
            </div>
        </>
    );
};

export default IsotopeGallery;