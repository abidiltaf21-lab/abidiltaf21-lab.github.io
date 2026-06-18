import React, { useEffect, useState } from 'react';
import ReactWOW from 'react-wow';
import { apiService } from '../../services/api';

const ShowreelSection: React.FC = () => {
    const [reels, setReels] = useState<any[]>([]);
    const [activeVideo, setActiveVideo] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReels = async () => {
            try {
                const { data } = await apiService.getVideos();
                if (data && Array.isArray(data)) {
                    setReels(data);
                    if (data.length > 0) {
                        const featured = data.find((p: any) => p.isFeatured || p.IsFeatured) || data[0];
                        setActiveVideo(featured.videoUrl || featured.VideoUrl);
                    }
                }
            } catch (err) {
                console.error("Showreel fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReels();
    }, []);

    const isDirectVideo = (url: string) => {
        if (!url) return false;
        return url.match(/\.(mp4|webm|ogg|mov|ts)(\?.*)?$/i) || url.includes('cloudinary.com');
    };

    const currentVideo = activeVideo || (reels[0]?.videoUrl || reels[0]?.VideoUrl);

    return (
        <section id="showreel" className="showreel-area default-padding overflow-hidden" style={{ background: '#c2c2c2' }}>
            <div className="container">
                <div className="row mb-5 align-items-end">
                    <div className="col-lg-8">
                        <div className="site-heading mb-0">
                            <h4 className="sub-title" style={{ color: 'var(--color-primary)', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '14px' }}>Cinematic Portfolio</h4>
                            <h2 className="title" style={{ 
                                background: 'linear-gradient(to right, #FFAE00, #F54200)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 900,
                                fontSize: '65px'
                            }}>Showreel Studio</h2>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-9">
                        <div className="video-aspect-ratio shadow-lg" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                            {isDirectVideo(currentVideo) ? (
                                <video 
                                    src={currentVideo} 
                                    controls 
                                    autoPlay 
                                    muted 
                                    loop 
                                    className="w-100 h-100 object-fit-cover"
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                />
                            ) : (
                                <iframe 
                                    src={`${currentVideo}${currentVideo?.includes('?') ? '&' : '?'}autoplay=1&mute=1`} 
                                    title="Showreel" 
                                    frameBorder="0" 
                                    allowFullScreen 
                                    loading="lazy"
                                ></iframe>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="reel-sidebar-scroll" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                            {reels.map((reel, idx) => (
                                <div 
                                    key={reel._id || reel.id || idx} 
                                    className={`reel-nav-item ${activeVideo === (reel.videoUrl || reel.VideoUrl) ? 'active' : ''}`} 
                                    onClick={() => setActiveVideo(reel.videoUrl || reel.VideoUrl)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="reel-thumb-mini">
                                            <i className="fas fa-play-circle"></i>
                                        </div>
                                        <div>
                                            <h6 className="m-0 text-dark fw-700">{reel.title || reel.Title}</h6>
                                            <span className="fs-12 text-muted">{reel.duration || reel.Duration || '00:45'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                .video-aspect-ratio { position: relative; padding-bottom: 56.25%; height: 0; border-radius: 20px; overflow: hidden; background: #000; border: 1px solid rgba(255,255,255,0.05); }
                .video-aspect-ratio iframe, .video-aspect-ratio video { position: absolute; top:0; left:0; width:100%; height:100%; }
                
                .reel-nav-item { 
                    padding: 20px; 
                    background: rgba(0,0,0,0.05); 
                    margin-bottom: 12px; 
                    cursor: pointer; 
                    border-radius: 16px; 
                    border: 1px solid rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                }
                .reel-nav-item:hover { background: rgba(0,0,0,0.1); transform: translateX(5px); }
                .reel-nav-item.active { background: var(--color-primary); border-color: var(--color-primary); }
                .reel-nav-item.active h6, .reel-nav-item.active span { color: #000 !important; }
                
                .reel-thumb-mini { width: 40px; height: 40px; border-radius: 10px; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; color: var(--color-primary); }
                .active .reel-thumb-mini { background: rgba(0,0,0,0.1); color: #000; }

                .reel-sidebar-scroll::-webkit-scrollbar { width: 4px; }
                .reel-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                .reel-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            `}</style>
        </section>
    );
};

export default ShowreelSection;
