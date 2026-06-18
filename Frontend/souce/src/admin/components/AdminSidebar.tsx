import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useInboxNotifications } from '../../context/useInboxNotifications';

export const AdminSidebar: React.FC = () => {
    const { logout } = useAuth();
    const { stats } = useInboxNotifications();
    const unreadCount = stats?.unread ?? 0;

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header mb-4 px-3">
                <div className="d-flex align-items-center">
                    <div className="logo-glow-box">
                        <i className="fas fa-cube fs-4" style={{ color: '#0f172a' }}></i>
                    </div>
                    <h3 className="m-0 fw-800 fs-5 ms-3" style={{ color: 'var(--admin-text-main)' }}>
                        Smooth<span style={{ color: 'var(--admin-accent)' }}>Pixel</span>
                    </h3>
                </div>
            </div>

            <div className="sidebar-menu mt-4">
                <p className="sidebar-label">Control Center</p>
                <NavLink to="/admin" end className="admin-nav-link">
                    <i className="fas fa-th-large"></i>
                    <span>Dashboard</span>
                </NavLink>

                <p className="sidebar-label">Portfolio & Media</p>
                <NavLink to="/admin/projects" className="admin-nav-link">
                    <i className="fas fa-layer-group"></i>
                    <span>Project Manager</span>
                </NavLink>
                <NavLink to="/admin/services" className="admin-nav-link">
                    <i className="fas fa-cogs"></i>
                    <span>Services Manager</span>
                </NavLink>
                <NavLink to="/admin/showreel" className="admin-nav-link">
                    <i className="fas fa-play-circle"></i>
                    <span>Showreel Studio</span>
                </NavLink>
                <NavLink to="/admin/categories" className="admin-nav-link">
                    <i className="fas fa-project-diagram"></i>
                    <span>Taxonomy (Categories)</span>
                </NavLink>

                <p className="sidebar-label">Team & Social</p>
                <NavLink to="/admin/team" className="admin-nav-link">
                    <i className="fas fa-users"></i>
                    <span>Team Roster</span>
                </NavLink>

                <NavLink to="/admin/reviews" className="admin-nav-link">
                    <i className="fas fa-star"></i>
                    <span>Review Moderation</span>
                </NavLink>

                <p className="sidebar-label">Commercials</p>
                <NavLink to="/admin/pricing" className="admin-nav-link">
                    <i className="fas fa-calculator"></i>
                    <span>Pricing Engine</span>
                </NavLink>

                <p className="sidebar-label">Engagement</p>
                <NavLink to="/admin/requests" className="admin-nav-link">
                    <i className="fas fa-inbox"></i>
                    <span>Client Inbox</span>
                    {unreadCount > 0 && (
                        <span className="sidebar-inbox-badge" aria-label={`${unreadCount} unread`}>
                            {unreadCount > 99 ? '99+' : String(unreadCount)}
                        </span>
                    )}
                </NavLink>

                <p className="sidebar-label">Infrastructure</p>
                <NavLink to="/admin/settings" className="admin-nav-link">
                    <i className="fas fa-sliders-h"></i>
                    <span>Site Config</span>
                </NavLink>
                <NavLink to="/admin/profile" className="admin-nav-link">
                    <i className="fas fa-user-shield"></i>
                    <span>Security & Profile</span>
                </NavLink>
                
                <div className="mt-5 pt-5 px-3">
                    <button onClick={logout} className="btn-logout-premium">
                        <i className="fas fa-power-off"></i>
                        <span>System Logout</span>
                    </button>
                </div>
            </div>

            <style>{`
                .admin-sidebar {
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    position: sticky;
                    top: 0;
                }
                .sidebar-menu {
                    flex: 1;
                    overflow-y: auto;
                    padding-right: 5px;
                }
                /* Custom thin scrollbar for sidebar */
                .sidebar-menu::-webkit-scrollbar {
                    width: 4px;
                }
                .sidebar-menu::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-menu::-webkit-scrollbar-thumb {
                    background: rgba(var(--sp-primary-rgb), 0.25);
                    border-radius: 10px;
                }
                .sidebar-menu::-webkit-scrollbar-thumb:hover {
                    background: var(--admin-accent);
                }

                .logo-glow-box {
                    width: 45px;
                    height: 45px;
                    background: linear-gradient(135deg, var(--admin-accent), var(--admin-blue));
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 20px rgba(var(--sp-primary-rgb), 0.3);
                }
                .sidebar-label {
                    font-size: 11px;
                    font-weight: 800;
                    color: var(--admin-text-muted);
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-top: 30px;
                    margin-bottom: 12px;
                    padding-left: 20px;
                    opacity: 0.9;
                }
                .btn-logout-premium {
                    width: 100%;
                    background: rgba(244, 63, 94, 0.05);
                    border: 1px solid rgba(244, 63, 94, 0.1);
                    color: #fb7185;
                    padding: 14px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-weight: 700;
                    font-size: 13px;
                    transition: all 0.3s;
                    cursor: pointer;
                }
                .btn-logout-premium:hover {
                    background: #fb7185;
                    color: #fff;
                    box-shadow: 0 10px 20px rgba(244, 63, 94, 0.2);
                }
                .admin-nav-link {
                    position: relative;
                }
                .sidebar-inbox-badge {
                    margin-left: auto;
                    min-width: 22px;
                    height: 22px;
                    padding: 0 7px;
                    background: #f43f5e;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 800;
                    line-height: 1;
                    font-variant-numeric: tabular-nums;
                    border-radius: 999px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 12px rgba(244, 63, 94, 0.4);
                    border: 2px solid var(--admin-bg);
                    flex-shrink: 0;
                }
            `}</style>
        </aside>
    );
};
