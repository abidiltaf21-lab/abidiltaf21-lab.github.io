import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useRequests } from '../hooks/useRequests';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import VisitorAnalyticsPanel from './components/VisitorAnalyticsPanel';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f43f5e', '#f59e0b'];

const Dashboard: React.FC = () => {
    const { projects, loading, error } = useProjects();
    const { requests, loading: requestsLoading } = useRequests();

    // Metrics Calculations
    const totalViews = useMemo(() => projects.reduce((acc, curr) => acc + (curr.views || 0), 0), [projects]);
    const totalVideos = useMemo(() => projects.filter(p => p.videoUrl).length, [projects]);
    const newRequestsCount = useMemo(() => requests.filter(r => r.status === 'New').length, [requests]);

    const latestVideoProject = useMemo(() => {
        const sorted = [...projects].sort((a, b) => Number(b.id) - Number(a.id));
        return sorted.find(p => p.videoUrl) || sorted[0];
    }, [projects]);

    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        projects.forEach(p => {
            const tag = p.tags && p.tags.length > 0 ? p.tags[0] : 'Uncategorized';
            counts[tag] = (counts[tag] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [projects]);

    const viewHistoryData = [
        { name: 'Jan', views: 400 }, { name: 'Feb', views: 600 }, { name: 'Mar', views: 800 },
        { name: 'Apr', views: 1200 }, { name: 'May', views: totalViews > 0 ? totalViews : 1500 }
    ];

    const topProjects = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);

    if (loading || requestsLoading) return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
            <div className="loader-glow-box">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}></div>
            </div>
            <p className="mt-4 text-muted fw-600 animate-pulse">Syncing with Creative Cloud...</p>
            <style>{`
                .loader-glow-box {
                    padding: 20px;
                    background: rgba(139, 92, 246, 0.1);
                    border-radius: 50%;
                    box-shadow: 0 0 40px rgba(139, 92, 246, 0.2);
                }
                @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
                .animate-pulse { animation: pulse 2s infinite; }
            `}</style>
        </div>
    );

    if (error) return <div className="p-5 text-danger text-center glass-panel m-5"><h3>Access Denied</h3><p>{error}</p></div>;

    return (
        <div className="animate-fade-in">
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-end mb-5">
                <div>
                    <h1 className="text-white mb-2 fw-800 fs-1" style={{ letterSpacing: '-1.5px' }}>Creative Center</h1>
                    <p className="text-muted m-0 fs-6">Welcome back, Designer. Your portfolio performance is optimal.</p>
                </div>
                <Link to="/admin/add" className="btn-neon">
                    <i className="fas fa-rocket"></i> Launch New Asset
                </Link>
            </div>

            {/* Premium Stat Grid */}
            <div className="row g-4 mb-5">
                {[
                    { label: 'Total Assets', val: projects.length, icon: 'fa-layer-group', color: 'purple' },
                    { label: 'Motion Clips', val: totalVideos, icon: 'fa-film', color: 'blue' },
                    { label: 'Global Views', val: totalViews.toLocaleString(), icon: 'fa-eye', color: 'green' },
                    { label: 'Active Leads', val: requests.length, icon: 'fa-user-astronaut', color: 'pink', badge: newRequestsCount }
                ].map((stat, i) => (
                    <div key={i} className="col-xl-3 col-md-6">
                        <div className="glass-panel p-4 d-flex align-items-center gap-4">
                            <div className={`stat-icon-box-v2 icon-${stat.color}`}>
                                <i className={`fas ${stat.icon}`}></i>
                            </div>
                            <div>
                                <span className="text-muted fs-11 fw-700 text-uppercase d-block mb-1" style={{ letterSpacing: '1px' }}>{stat.label}</span>
                                <h3 className="text-white m-0 fw-800 d-flex align-items-center">
                                    {stat.val}
                                    {stat.badge ? <span className="ms-2 badge-pulse-v2">{stat.badge}</span> : null}
                                </h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <VisitorAnalyticsPanel />

            <div className="row g-4">
                <div className="col-xl-8">
                    <div className="glass-panel p-4 mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <h5 className="text-white m-0 fw-700">Engagement Dynamics</h5>
                            <div className="chart-legend-pill">Interactions / Month</div>
                        </div>
                        <div style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={viewHistoryData}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="name" stroke="#475569" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                                    <YAxis stroke="#475569" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600}} />
                                    <RechartsTooltip 
                                        contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#8b5cf6', fontWeight: 800 }}
                                    />
                                    <Area type="monotone" dataKey="views" stroke="#8b5cf6" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="glass-panel p-4 h-100">
                                <h5 className="text-white mb-4 fw-700">Taxonomy Distribution</h5>
                                <div style={{ height: '240px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={10} dataKey="value" stroke="none">
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="glass-panel p-4 h-100">
                                <h5 className="text-white mb-4 fw-700">Top-Performing Assets</h5>
                                <div className="d-flex flex-column gap-3">
                                    {topProjects.map((project, idx) => (
                                        <div key={project.id} className="asset-rank-card d-flex align-items-center gap-3">
                                            <div className="rank-num">{idx + 1}</div>
                                            <div className="flex-grow-1">
                                                <h6 className="text-white m-0 fs-14 fw-600">{project.title}</h6>
                                                <span className="text-muted fs-12">{project.views || 0} Views</span>
                                            </div>
                                            <i className="fas fa-chevron-right text-muted fs-11"></i>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-xl-4">
                    <div className="glass-panel p-0 overflow-hidden mb-4">
                        <div className="p-4 border-bottom-glass d-flex align-items-center justify-content-between">
                            <h5 className="text-white m-0 fs-14 fw-700">Live Preview Engine</h5>
                            <span className="badge-live-v2">ACTIVE</span>
                        </div>
                        <div className="live-preview-container">
                            {latestVideoProject ? (
                                <>
                                    <div className="preview-media-v2">
                                        {latestVideoProject.videoUrl ? (
                                            latestVideoProject.videoUrl.match(/\.(mp4|webm|ogg|mov|ts)$/i) || latestVideoProject.videoUrl.includes('cloudinary.com') && latestVideoProject.videoUrl.includes('/video/upload/') ? (
                                                <video src={latestVideoProject.videoUrl} autoPlay muted loop playsInline />
                                            ) : (
                                                <div className="ratio ratio-16x9">
                                                    <iframe src={`${latestVideoProject.videoUrl}${latestVideoProject.videoUrl.includes('?') ? '&' : '?'}autoplay=1&mute=1`} title="P" frameBorder="0"></iframe>
                                                </div>
                                            )
                                        ) : (
                                            <img src={latestVideoProject.thumb} alt="P" className="w-100 h-100 object-fit-cover" />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h6 className="text-white m-0 fw-800">{latestVideoProject.title}</h6>
                                        <p className="text-muted fs-12 mt-2 mb-0">Newly synchronized project asset.</p>
                                    </div>
                                </>
                            ) : (
                                <div className="p-5 text-center text-muted fs-14">Awaiting Signal...</div>
                            )}
                        </div>
                    </div>

                    <div className="glass-panel p-4">
                        <h5 className="text-white mb-4 fw-700">Activity Ledger</h5>
                        <div className="activity-timeline-v2">
                            {projects.slice(0, 4).map((p, i) => (
                                <div key={p.id} className="activity-item-v2">
                                    <div className="activity-line"></div>
                                    <div className="activity-dot"></div>
                                    <div className="activity-content-v2">
                                        <p className="text-white m-0 fs-13 fw-600">Asset Sync: {p.title}</p>
                                        <span className="text-muted fs-11 text-uppercase">{p.projectDate ? new Date(p.projectDate).toLocaleDateString() : 'Active'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .fs-11 { font-size: 11px; }
                .fs-12 { font-size: 12px; }
                .fs-13 { font-size: 13px; }
                .fs-14 { font-size: 14px; }
                
                .stat-icon-box-v2 {
                    width: 55px;
                    height: 55px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                .icon-purple { background: rgba(139, 92, 246, 0.15); color: #a78bfa; }
                .icon-blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
                .icon-green { background: rgba(16, 185, 129, 0.15); color: #34d399; }
                .icon-pink { background: rgba(244, 63, 94, 0.15); color: #fb7185; }

                .badge-pulse-v2 {
                    background: var(--admin-pink);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 10px;
                    box-shadow: 0 0 15px rgba(244, 63, 94, 0.4);
                    animation: pulse-pink 2s infinite;
                }
                @keyframes pulse-pink { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

                .chart-legend-pill {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid var(--admin-glass-border);
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 11px;
                    color: var(--admin-text-muted);
                    font-weight: 700;
                }

                .asset-rank-card {
                    padding: 12px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 14px;
                    transition: var(--transition-smooth);
                }
                .asset-rank-card:hover { background: rgba(255,255,255,0.05); transform: translateX(5px); border-color: var(--admin-accent); }
                .rank-num { font-size: 18px; font-weight: 900; color: #1e293b; width: 25px; }

                .badge-live-v2 {
                    background: var(--admin-pink);
                    font-size: 9px;
                    font-weight: 900;
                    padding: 4px 8px;
                    border-radius: 4px;
                    letter-spacing: 1px;
                }
                .preview-media-v2 {
                    background: #000;
                    aspect-ratio: 16/9;
                    overflow: hidden;
                }
                .preview-media-v2 video, .preview-media-v2 img { width: 100%; height: 100%; object-fit: cover; }

                .activity-timeline-v2 { padding-left: 10px; }
                .activity-item-v2 { position: relative; padding-left: 25px; padding-bottom: 25px; }
                .activity-line { position: absolute; left: 0; top: 10px; bottom: 0; width: 1px; background: var(--admin-glass-border); }
                .activity-dot { position: absolute; left: -4px; top: 10px; width: 9px; height: 9px; background: var(--admin-accent); border-radius: 50%; box-shadow: 0 0 10px var(--admin-accent); }
                .activity-item-v2:last-child .activity-line { display: none; }
            `}</style>
        </div>
    );
};

export default Dashboard;
