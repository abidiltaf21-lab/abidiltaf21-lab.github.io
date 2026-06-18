import React, { useMemo, useState } from 'react';
import { useProjects } from '../hooks/useProjects';

const MediaLibrary: React.FC = () => {
    const { projects } = useProjects();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'video' | 'image'>('all');

    const mediaAssets = useMemo(() => {
        const assets: any[] = [];
        const seen = new Set<string>();

        projects.forEach(p => {
            if (p.videoUrl && !seen.has(p.videoUrl)) {
                seen.add(p.videoUrl);
                assets.push({
                    url: p.videoUrl,
                    type: 'video',
                    projectName: p.title,
                    id: p.id
                });
            }
            if (p.thumb && !seen.has(p.thumb)) {
                seen.add(p.thumb);
                assets.push({
                    url: p.thumb,
                    type: 'image',
                    projectName: p.title,
                    id: p.id
                });
            }
        });

        return assets.filter(a => {
            const matchesSearch = a.url.toLowerCase().includes(searchQuery.toLowerCase()) || a.projectName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = filter === 'all' || a.type === filter;
            return matchesSearch && matchesFilter;
        });
    }, [projects, searchQuery, filter]);

    return (
        <div className="animate-fade-in">
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="text-white mb-2 fw-800 fs-1" style={{ letterSpacing: '-1.5px' }}>Asset Vault</h1>
                    <p className="text-muted m-0 fs-6">A centralized repository for high-fidelity synchronized assets.</p>
                </div>
                <button className="btn-neon">
                    <i className="fas fa-file-import"></i> Initialize Batch
                </button>
            </div>

            <div className="glass-panel p-4 mb-5 d-flex flex-wrap justify-content-between align-items-center gap-4">
                <div className="d-flex gap-2">
                    {['all', 'video', 'image'].map((f) => (
                        <button key={f} onClick={() => setFilter(f as any)} 
                            className={`pill-btn-v2 ${filter === f ? 'active' : ''}`}>
                            {f === 'all' ? 'All Assets' : f === 'video' ? 'Motion Streams' : 'Static Nodes'}
                        </button>
                    ))}
                </div>
                <div className="search-container-v2" style={{ width: '350px' }}>
                    <i className="fas fa-search"></i>
                    <input 
                        type="text" 
                        placeholder="Search vaults..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="row g-4">
                {mediaAssets.length === 0 ? (
                    <div className="col-12 text-center py-5 glass-panel">
                        <p className="text-muted fs-14 m-0">No assets detected in the primary stream.</p>
                    </div>
                ) : (
                    mediaAssets.map((asset, idx) => (
                        <div key={idx} className="col-xl-2 col-lg-3 col-md-4">
                            <div className="asset-card-v2 glass-panel h-100 p-0 border-0">
                                <div className="media-preview-v2">
                                    {asset.type === 'video' ? (
                                        <div className="video-glyph-v2 d-flex align-items-center justify-content-center">
                                            <i className="fas fa-film text-primary opacity-50"></i>
                                        </div>
                                    ) : (
                                        <img src={asset.url?.startsWith('http') ? asset.url : `/assets/img/projects/${asset.url}`} alt="P" />
                                    )}
                                    <div className="asset-type-chip">{asset.type}</div>
                                    <div className="media-overlay-actions-v2">
                                        <button className="mini-action-btn"><i className="fas fa-link"></i></button>
                                        <button className="mini-action-btn delete"><i className="fas fa-trash-alt"></i></button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-white fs-11 fw-700 m-0 text-truncate" title={asset.url}>{asset.url.split('/').pop()}</p>
                                    <span className="text-muted fs-10 d-block mt-1">Node: {asset.projectName}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .fs-10 { font-size: 10px; }
                .fs-11 { font-size: 11px; }
                
                .media-preview-v2 {
                    position: relative;
                    aspect-ratio: 1/1;
                    background: rgba(0,0,0,0.4);
                    overflow: hidden;
                    border-radius: 16px 16px 0 0;
                }
                .media-preview-v2 img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
                .asset-card-v2:hover .media-preview-v2 img { transform: scale(1.1); }
                
                .video-glyph-v2 { height: 100%; font-size: 40px; background: rgba(139, 92, 246, 0.05); }
                
                .asset-type-chip {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: rgba(139, 92, 246, 0.8);
                    backdrop-filter: blur(5px);
                    color: #fff;
                    font-size: 8px;
                    font-weight: 900;
                    padding: 2px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    z-index: 2;
                }

                .media-overlay-actions-v2 {
                    position: absolute;
                    inset: 0;
                    background: rgba(3, 7, 18, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    opacity: 0;
                    transition: var(--transition-smooth);
                    z-index: 3;
                }
                .asset-card-v2:hover .media-overlay-actions-v2 { opacity: 1; }

                .mini-action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 10px;
                    background: #fff;
                    color: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    border: none;
                    transition: var(--transition-smooth);
                }
                .mini-action-btn:hover { transform: scale(1.1); background: var(--admin-accent); color: #fff; }
                .mini-action-btn.delete:hover { background: var(--admin-pink); }
            `}</style>
        </div>
    );
};

export default MediaLibrary;
