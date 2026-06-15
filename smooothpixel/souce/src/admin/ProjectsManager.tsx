import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';

const ProjectsManager: React.FC = () => {
    const { projects, loading, error, deleteProject } = useProjects();
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'views' | 'title'>('date');

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this creative asset? This action cannot be undone.')) {
            const { error: deleteError } = await deleteProject(id);
            if (deleteError) {
                alert('Error de-synchronizing project: ' + deleteError.message);
            }
        }
    };

    const categories = useMemo(() => {
        const allTags = new Set<string>();
        projects.forEach(p => {
            if (p.tags && p.tags.length > 0) {
                p.tags.forEach(t => allTags.add(t));
            } else {
                allTags.add('Uncategorized');
            }
        });
        return ['All', ...Array.from(allTags)];
    }, [projects]);

    const processedProjects = useMemo(() => {
        const filtered = projects.filter(p => {
            const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase());
            const hasTag = p.tags && p.tags.length > 0 ? p.tags : ['Uncategorized'];
            const matchesCategory = selectedCategory === 'All' || hasTag.includes(selectedCategory);
            return matchesSearch && matchesCategory;
        });

        return filtered.sort((a, b) => {
            if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
            if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
            return Number(b.id) - Number(a.id);
        });
    }, [projects, selectedCategory, searchQuery, sortBy]);

    if (loading) return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="loader-glow-box">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
            <p className="mt-4 text-muted fw-600 animate-pulse">Scanning Inventory...</p>
        </div>
    );

    if (error) return <div className="p-5 text-danger glass-panel m-5 text-center"><h4>System Offline</h4><p>{error}</p></div>;

    return (
        <div className="animate-fade-in">
            {/* Header Area */}
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="text-white mb-2 fw-800 fs-1" style={{ letterSpacing: '-1.5px' }}>Project Inventory</h1>
                    <p className="text-muted m-0 fs-6">Manage and optimize your motion graphics high-fidelity assets.</p>
                </div>
                <Link to="/admin/add" className="btn-neon">
                    <i className="fas fa-plus-circle"></i> Initialize Asset
                </Link>
            </div>

            {/* Smart Control Bar */}
            <div className="glass-panel p-4 mb-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-5">
                        <div className="d-flex gap-2 category-scroll-v2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`pill-btn-v2 ${selectedCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="search-container-v2">
                            <i className="fas fa-search"></i>
                            <input 
                                type="text" 
                                placeholder="Locate by title..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-3">
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-muted fs-11 fw-800 text-uppercase">Sort</span>
                            <select 
                                className="form-input-premium py-2"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as any)}
                            >
                                <option value="date">Latest First</option>
                                <option value="views">Most Viewed</option>
                                <option value="title">Alphabetical</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Asset Grid */}
            <div className="row g-4">
                {processedProjects.length === 0 ? (
                    <div className="col-12 text-center py-5 glass-panel">
                        <i className="fas fa-ghost fs-1 text-muted mb-3"></i>
                        <h4 className="text-white">Void Detected</h4>
                        <p className="text-muted">No projects found matching your current parameters.</p>
                    </div>
                ) : (
                    processedProjects.map((project, idx) => (
                        <div key={project.id} className="col-xl-4 col-md-6">
                            <div className="asset-card-v2 glass-panel">
                                <div className="asset-preview-v2">
                                    {(() => {
                                        let vUrl = project.videoUrl || "";
                                        if (vUrl.includes('cloudinary.com') && vUrl.toLowerCase().endsWith('.ts')) {
                                            vUrl = vUrl.replace(/\.ts$/i, '.mp4');
                                        }
                                        const hasVideo = vUrl && (vUrl.match(/\.(mp4|webm|mov|ts)(\?.*)?$/i) || vUrl.includes('cloudinary.com'));
                                        const thumbUrl = project.thumb && project.thumb.startsWith('http') 
                                            ? project.thumb 
                                            : (project.thumb ? `/assets/img/projects/${project.thumb}` : 'https://placehold.co/600x400/0f172a/FFF?text=No+Thumbnail');

                                        return hasVideo ? (
                                            <div className="video-hover-container w-100 h-100">
                                                <video 
                                                    src={vUrl} 
                                                    muted 
                                                    loop 
                                                    playsInline 
                                                    className="asset-video-v2"
                                                    poster={thumbUrl}
                                                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                                    onMouseOut={(e) => {
                                                        const v = e.target as HTMLVideoElement;
                                                        v.pause();
                                                        v.currentTime = 0;
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <img src={thumbUrl} alt={project.title} />
                                        );
                                    })()}
                                    
                                    <div className="asset-badges-v2">
                                        {project.isFeatured && <span className="badge-v2-featured">Featured</span>}
                                        {project.visibility === 'private' && <span className="badge-v2-private">Private</span>}
                                    </div>

                                    <div className="asset-actions-v2">
                                        <Link to={`/admin/edit/${project.id}`} className="action-btn-v2">
                                            <i className="fas fa-edit"></i>
                                        </Link>
                                        <button onClick={() => handleDelete(project.id)} className="action-btn-v2 delete">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="text-white m-0 fw-700 text-truncate pe-3">{project.title}</h5>
                                        <div className="views-chip-v2">
                                            <i className="fas fa-eye me-1"></i> {project.views || 0}
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        {project.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="tag-v2">{tag}</span>
                                        ))}
                                        {(project.tags?.length || 0) > 2 && <span className="tag-v2">+{project.tags!.length - 2}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .category-scroll-v2 {
                    overflow-x: auto;
                    padding-bottom: 5px;
                }
                .category-scroll-v2::-webkit-scrollbar { height: 3px; }
                .category-scroll-v2::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

                .pill-btn-v2 {
                    background: rgba(255,255,255,0.02);
                    color: #64748b;
                    border: 1px solid var(--admin-glass-border);
                    padding: 8px 18px;
                    border-radius: 100px;
                    font-size: 13px;
                    font-weight: 700;
                    white-space: nowrap;
                    transition: var(--transition-smooth);
                    cursor: pointer;
                }
                .pill-btn-v2:hover { border-color: var(--admin-accent); color: #fff; }
                .pill-btn-v2.active {
                    background: var(--admin-accent);
                    color: #fff;
                    border-color: var(--admin-accent);
                    box-shadow: 0 5px 15px rgba(139, 92, 246, 0.3);
                }

                .search-container-v2 {
                    position: relative;
                }
                .search-container-v2 i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #64748b; }
                .search-container-v2 input {
                    width: 100%;
                    background: rgba(2, 6, 23, 0.4);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 14px;
                    padding: 10px 15px 10px 45px;
                    color: #fff;
                    font-size: 14px;
                    outline: none;
                    transition: var(--transition-smooth);
                }
                .search-container-v2 input:focus { border-color: var(--admin-accent); background: rgba(2, 6, 23, 0.6); }

                .asset-card-v2 {
                    overflow: hidden;
                    transition: var(--transition-smooth);
                }
                .asset-card-v2:hover { transform: translateY(-8px); }

                .asset-preview-v2 {
                    position: relative;
                    aspect-ratio: 16/10;
                    overflow: hidden;
                }
                .asset-preview-v2 img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
                .asset-card-v2:hover .asset-preview-v2 img { transform: scale(1.1); }

                .video-hover-container { position: relative; width: 100%; height: 100%; background: #000; }
                .asset-video-v2 { width: 100%; height: 100%; object-fit: cover; cursor: pointer; }

                .asset-badges-v2 {
                    position: absolute;
                    top: 15px;
                    left: 15px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    z-index: 2;
                }
                .badge-v2-featured { background: #f59e0b; color: #000; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }
                .badge-v2-private { background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); color: #fff; font-size: 9px; font-weight: 900; padding: 4px 10px; border-radius: 6px; text-transform: uppercase; }

                .asset-actions-v2 {
                    position: absolute;
                    inset: 0;
                    background: rgba(3, 7, 18, 0.6);
                    backdrop-filter: blur(4px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    opacity: 0;
                    transition: var(--transition-smooth);
                    z-index: 3;
                }
                .asset-card-v2:hover .asset-actions-v2 { opacity: 1; }

                .action-btn-v2 {
                    width: 45px;
                    height: 45px;
                    border-radius: 12px;
                    background: #fff;
                    color: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: var(--transition-smooth);
                    border: none;
                    text-decoration: none;
                }
                .action-btn-v2:hover { transform: scale(1.1); background: var(--admin-accent); color: #fff; }
                .action-btn-v2.delete:hover { background: var(--admin-pink); }

                .views-chip-v2 {
                    background: rgba(255,255,255,0.05);
                    color: var(--admin-accent);
                    padding: 4px 10px;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 800;
                }
                .tag-v2 { font-size: 10px; color: #64748b; background: rgba(255,255,255,0.02); border: 1px solid var(--admin-glass-border); padding: 4px 10px; border-radius: 6px; }
            `}</style>
        </div>
    );
};

export default ProjectsManager;
