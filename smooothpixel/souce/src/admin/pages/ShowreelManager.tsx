import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ShowreelManager: React.FC = () => {
    const [reels, setReels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchReels = async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getVideos();
            setReels(data);
        } catch (err) {
            console.error("Failed to fetch reels:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: any) => {
        if (window.confirm("Are you sure you want to delete this reel?")) {
            try {
                await apiService.deleteVideo(id);
                setReels(prev => prev.filter(r => (r._id || r.id) !== id));
            } catch (err) {
                alert("Failed to delete reel");
            }
        }
    };

    useEffect(() => {
        fetchReels();
    }, []);

    return (
        <div className="animate-fade-in">
            <div className="admin-page-header">
                <div>
                    <h2 className="admin-title">Showreel Studio</h2>
                    <p className="admin-subtitle">Control your cinematic portfolio and featured highlights.</p>
                </div>
                <button className="btn-admin-primary" onClick={() => navigate('/admin/showreel/add')}>
                    <i className="fas fa-video me-2"></i> Upload New Reel
                </button>
            </div>

            <div className="row g-4">
                {loading ? (
                    <div className="col-12 text-center p-5">Loading Showreels...</div>
                ) : reels.length === 0 ? (
                    <div className="col-12 text-center p-5 text-muted">No showreel assets found. Add your best work.</div>
                ) : (
                    reels.map(reel => (
                        <div className="col-lg-6" key={reel._id || reel.id}>
                            <div className="admin-card h-100 p-0 overflow-hidden">
                                <div className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div>
                                            <h4 className="m-0 fw-800">{reel.title || reel.Title}</h4>
                                            <span className="text-muted fs-7">{reel.duration || reel.Duration || '00:00'}</span>
                                        </div>
                                        {(reel.isFeatured || reel.IsFeatured) && <span className="badge bg-gold">Featured</span>}
                                    </div>
                                    <div className="video-placeholder-admin mb-3 overflow-hidden">
                                        {(reel.thumb || reel.Thumb) ? (
                                            <img src={reel.thumb || reel.Thumb} className="w-100 h-100 object-fit-cover rounded-3" alt="" />
                                        ) : (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-dark rounded-3">
                                                <i className="fas fa-play fs-1 opacity-25"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn-admin-secondary flex-grow-1" onClick={() => navigate(`/admin/showreel/edit/${reel._id || reel.id}`)}>Edit Details</button>
                                        <button className="btn-admin-danger" onClick={() => handleDelete(reel._id || reel.id)}><i className="fas fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .video-placeholder-admin {
                    aspect-ratio: 16/9;
                    background: #000;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .bg-gold {
                    background: var(--color-primary);
                    color: #000;
                    font-weight: 800;
                    font-size: 10px;
                    text-transform: uppercase;
                }
            `}</style>
        </div>
    );
};

export default ShowreelManager;
