import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useInboxNotifications } from '../../context/useInboxNotifications';

function formatAlertTime(dateStr: string) {
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

export const AdminHeader: React.FC = () => {
    const { user } = useAuth();
    const { stats, recentUnread, requestNotificationPermission, notificationsEnabled, refresh } =
        useInboxNotifications();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [notifOpen, setNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = stats?.unread ?? 0;

    useEffect(() => {
        const savedTheme = localStorage.getItem('adminTheme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('adminTheme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        if (granted) refresh();
    };

    const toggleNotifDropdown = () => {
        setNotifOpen((open) => {
            const next = !open;
            if (next) refresh();
            return next;
        });
    };

    return (
        <header className="admin-header d-flex align-items-center justify-content-between">
            <div className="search-container">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search commands or assets..." />
            </div>

            <div className="d-flex align-items-center gap-4">
                <div className="header-status-pill">
                    <span className="status-dot"></span>
                    System Live
                </div>

                <div className="header-icon-group d-flex gap-2 align-items-center" style={{ overflow: 'visible' }}>
                    <div className="notif-dropdown-wrap" ref={notifRef}>
                        <button
                            type="button"
                            className={`header-icon-btn notif-bell ${unreadCount > 0 ? 'has-unread' : ''}`}
                            onClick={toggleNotifDropdown}
                            aria-label="Inbox notifications"
                            aria-expanded={notifOpen}
                        >
                            <i className="far fa-bell"></i>
                            {unreadCount > 0 && (
                                <span className="notif-badge" aria-label={`${unreadCount} unread messages`}>
                                    {unreadCount > 99 ? '99+' : String(unreadCount)}
                                </span>
                            )}
                        </button>

                        {notifOpen && (
                            <div className="notif-dropdown" role="menu">
                                <div className="notif-dropdown-header">
                                    <h6 className="m-0 fw-700 notif-dropdown-title">Inbox alerts</h6>
                                    <span className="notif-meta">
                                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                                    </span>
                                </div>

                                {!notificationsEnabled && (
                                    <div className="notif-enable-banner">
                                        <p className="m-0 fs-12 text-muted">Get browser alerts for new messages.</p>
                                        <button type="button" className="notif-enable-btn" onClick={handleEnableNotifications}>
                                            Enable notifications
                                        </button>
                                    </div>
                                )}

                                <div className="notif-dropdown-body custom-scrollbar">
                                    {recentUnread.length === 0 ? (
                                        <p className="text-muted fs-12 p-4 m-0 text-center">No unread messages</p>
                                    ) : (
                                        recentUnread.map((msg) => (
                                            <Link
                                                key={msg.id}
                                                to={`/admin/requests?id=${msg.id}`}
                                                className="notif-item"
                                                onClick={() => setNotifOpen(false)}
                                                role="menuitem"
                                            >
                                                <div className="notif-item-top">
                                                    <div className="d-flex align-items-center gap-2 min-w-0">
                                                        <span className="notif-unread-dot" aria-hidden />
                                                        <strong className="fs-13 text-truncate notif-dropdown-title">{msg.name}</strong>
                                                    </div>
                                                    <span className="notif-time">{formatAlertTime(msg.createdAt)}</span>
                                                </div>
                                                <p className="m-0 fs-11 text-muted text-truncate">{msg.message}</p>
                                                <div className="notif-item-meta">
                                                    <span className="notif-channel">
                                                        <i className="fas fa-envelope"></i> Email
                                                    </span>
                                                    {msg.telegram && (
                                                        <span className="notif-channel telegram">
                                                            <i className="fab fa-telegram-plane"></i> Telegram
                                                        </span>
                                                    )}
                                                    <span className="notif-status-pill">{msg.status}</span>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>

                                <div className="notif-dropdown-footer">
                                    <Link
                                        to="/admin/requests"
                                        className="notif-view-all"
                                        onClick={() => setNotifOpen(false)}
                                    >
                                        Open Client Inbox <i className="fas fa-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="button" className="header-icon-btn" onClick={toggleTheme}>
                        <i className={theme === 'dark' ? 'far fa-moon' : 'fas fa-sun'}></i>
                    </button>
                </div>

                <div className="admin-profile-chip d-flex align-items-center">
                    <div className="profile-info text-end me-3 d-none d-md-block">
                        <p className="m-0 fw-700 fs-9 admin-header-title">Admin Center</p>
                        <p className="m-0 text-muted fs-10">{user?.email || 'operator@antux.io'}</p>
                    </div>
                    <div className="profile-avatar">
                        <i className="fas fa-user-shield"></i>
                    </div>
                </div>
            </div>

            <style>{`
                .admin-header-title,
                .notif-dropdown-title { color: var(--admin-text-main); }
                .admin-header {
                    height: 80px;
                    padding: 0 30px;
                    background: var(--admin-glass);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid var(--admin-glass-border);
                    position: sticky;
                    top: 0;
                    z-index: 99;
                    overflow: visible;
                }
                .search-container {
                    background: rgba(var(--sp-primary-rgb), 0.04);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 14px;
                    padding: 10px 20px;
                    width: 350px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: var(--transition-smooth);
                }
                .search-container:focus-within {
                    border-color: var(--admin-accent);
                    background: rgba(255,255,255,0.05);
                    width: 400px;
                }
                .search-container i { color: var(--admin-text-muted); }
                .search-container input {
                    background: transparent;
                    border: none;
                    outline: none;
                    color: var(--admin-text-main);
                    font-size: 14px;
                    width: 100%;
                }
                .search-container input::placeholder { color: var(--admin-text-muted); }
                .header-status-pill {
                    background: rgba(16, 185, 129, 0.1);
                    color: #10b981;
                    font-size: 11px;
                    font-weight: 800;
                    padding: 6px 12px;
                    border-radius: 100px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-transform: uppercase;
                }
                .status-dot {
                    width: 6px;
                    height: 6px;
                    background: #10b981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10b981;
                }
                .header-icon-group { overflow: visible; }
                .header-icon-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    border: 1px solid var(--admin-glass-border);
                    background: transparent;
                    color: #94a3b8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-smooth);
                    position: relative;
                    cursor: pointer;
                    overflow: visible;
                }
                .notif-bell { overflow: visible; }
                .header-icon-btn:hover {
                    background: rgba(var(--sp-primary-rgb), 0.1);
                    color: var(--admin-accent);
                }
                .notif-bell.has-unread { color: #fbbf24; border-color: rgba(251,191,36,0.3); }
                .notif-badge {
                    position: absolute;
                    top: -7px;
                    right: -7px;
                    min-width: 22px;
                    height: 22px;
                    padding: 0 6px;
                    background: #f43f5e;
                    color: #fff;
                    font-size: 11px;
                    font-weight: 800;
                    line-height: 1;
                    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
                    font-variant-numeric: tabular-nums;
                    border-radius: 999px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 12px rgba(244,63,94,0.55);
                    border: 2px solid var(--admin-bg);
                    box-sizing: border-box;
                    z-index: 20;
                    pointer-events: none;
                    white-space: nowrap;
                }
                .notif-dropdown-wrap { position: relative; overflow: visible; }
                .notif-dropdown {
                    position: absolute;
                    top: calc(100% + 12px);
                    right: 0;
                    width: 360px;
                    background: var(--admin-bg-alt);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 16px;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    z-index: 200;
                    overflow: hidden;
                }
                .notif-dropdown-header {
                    padding: 16px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 12px;
                }
                .notif-meta { font-size: 11px; color: #f43f5e; font-weight: 700; white-space: nowrap; }
                .notif-enable-banner {
                    padding: 12px 18px;
                    background: rgba(var(--sp-primary-rgb), 0.08);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                }
                .notif-enable-btn {
                    margin-top: 8px;
                    width: 100%;
                    background: var(--admin-accent);
                    border: none;
                    color: #fff;
                    border-radius: 8px;
                    padding: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .notif-dropdown-body { max-height: 320px; overflow-y: auto; }
                .notif-item {
                    display: block;
                    padding: 14px 18px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    text-decoration: none;
                    transition: background 0.2s;
                }
                .notif-item:hover { background: rgba(var(--sp-primary-rgb), 0.08); }
                .notif-item-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 6px;
                }
                .notif-unread-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #f43f5e;
                    flex-shrink: 0;
                    box-shadow: 0 0 6px #f43f5e;
                }
                .notif-time {
                    font-size: 10px;
                    color: #64748b;
                    font-weight: 600;
                    white-space: nowrap;
                }
                .notif-item-meta {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 8px;
                    margin-top: 8px;
                }
                .notif-channel {
                    font-size: 10px;
                    color: #94a3b8;
                    font-weight: 600;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }
                .notif-channel.telegram { color: #38bdf8; }
                .notif-status-pill {
                    font-size: 9px;
                    font-weight: 800;
                    color: #b45309;
                    background: rgba(var(--sp-primary-rgb), 0.2);
                    padding: 2px 6px;
                    border-radius: 4px;
                    text-transform: uppercase;
                    margin-left: auto;
                }
                .notif-dropdown-footer {
                    border-top: 1px solid rgba(255,255,255,0.08);
                }
                .notif-view-all {
                    display: block;
                    text-align: center;
                    padding: 14px;
                    color: var(--admin-accent);
                    font-size: 13px;
                    font-weight: 700;
                    text-decoration: none;
                }
                .notif-view-all:hover { background: rgba(var(--sp-primary-rgb), 0.1); color: var(--admin-text-main); }
                .profile-avatar {
                    width: 45px;
                    height: 45px;
                    background: var(--admin-accent);
                    color: #0f172a;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    box-shadow: 0 5px 15px rgba(var(--sp-primary-rgb), 0.35);
                }
                .fs-9 { font-size: 13px; }
                .fs-10 { font-size: 11px; }
                .fs-12 { font-size: 12px; }
                .fs-13 { font-size: 13px; }
            `}</style>
        </header>
    );
};
