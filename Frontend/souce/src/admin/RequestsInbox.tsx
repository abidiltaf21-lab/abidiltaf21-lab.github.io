import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClientRequest, useRequests } from '../hooks/useRequests';
import { useInboxNotifications } from '../context/useInboxNotifications';
import { openReplyByEmail } from '../utils/emailReply';
import { toTelegramUrl } from '../utils/telegramLink';

const COMPANY_TELEGRAM_URL = 'https://t.me/SmooothPixel';

const STATUS_TABS = [
    { key: 'all', label: 'All' },
    { key: 'New', label: 'New' },
    { key: 'In Progress', label: 'In Progress' },
    { key: 'Closed', label: 'Closed' },
];

function formatRelativeTime(dateStr: string) {
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

const RequestsInbox: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [notesDraft, setNotesDraft] = useState('');

    const { refresh: refreshNotifications } = useInboxNotifications();

    useEffect(() => {
        const t = window.setTimeout(() => setDebouncedSearch(search), 350);
        return () => window.clearTimeout(t);
    }, [search]);

    const {
        requests,
        stats,
        loading,
        error,
        refresh,
        updateRequestStatus,
        updateInternalNotes,
        markAsRead,
        markAllRead,
        deleteRequest,
    } = useRequests(
        { status: statusFilter, search: debouncedSearch, sort, unreadOnly },
        30000
    );

    const selectedRequest = useMemo(
        () => requests.find((r) => r.id === selectedId) ?? null,
        [requests, selectedId]
    );

    const selectedTelegramUrl = useMemo(
        () => toTelegramUrl(selectedRequest?.telegram),
        [selectedRequest?.telegram]
    );

    useEffect(() => {
        const idParam = searchParams.get('id');
        if (idParam) {
            const parsed = Number(idParam);
            if (!Number.isNaN(parsed) && requests.some((r) => r.id === parsed)) {
                setSelectedId(parsed);
                return;
            }
        }
    }, [searchParams, requests]);

    useEffect(() => {
        if (requests.length === 0) {
            setSelectedId(null);
            return;
        }
        if (selectedId != null && requests.some((r) => r.id === selectedId)) return;
        const firstUnread = requests.find((r) => !r.isRead) ?? requests[0];
        setSelectedId(firstUnread.id);
    }, [requests, selectedId]);

    const handleSelectMessage = (id: number) => {
        setSelectedId(id);
        setSearchParams({ id: String(id) }, { replace: true });
    };

    useEffect(() => {
        if (!selectedRequest) return;
        setNotesDraft(selectedRequest.internalNotes || '');
        if (!selectedRequest.isRead) {
            markAsRead(selectedRequest.id, true)
                .then(() => refreshNotifications())
                .catch(() => {
                    /* API may be outdated; keep local UI usable */
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRequest?.id]);

    const handleSelect = async (req: ClientRequest) => {
        handleSelectMessage(req.id);
        if (!req.isRead) {
            await markAsRead(req.id, true);
            refreshNotifications();
        }
    };

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await updateRequestStatus(id, status);
            toast.success('Status updated');
            await refresh();
            refreshNotifications();
        } catch {
            toast.error('Failed to update status. Restart ReactApi if this keeps failing.');
        }
    };

    const handleSaveNotes = async () => {
        if (!selectedRequest) return;
        try {
            await updateInternalNotes(selectedRequest.id, notesDraft);
            toast.success('Notes saved');
        } catch {
            toast.error('Failed to save notes');
        }
    };

    const handleDelete = async () => {
        if (!selectedRequest) return;
        if (!window.confirm(`Delete message from ${selectedRequest.name}?`)) return;
        try {
            await deleteRequest(selectedRequest.id);
            setSelectedId(null);
            toast.success('Message deleted');
            refreshNotifications();
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 405) {
                toast.error('Delete not supported. Restart ReactApi in Visual Studio, then try again.');
            } else {
                toast.error('Failed to delete');
            }
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllRead();
            toast.success('All messages marked as read');
            refreshNotifications();
        } catch {
            toast.error('Failed to mark all as read');
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.info(`${label} copied`);
    };

    const handleReplyByEmail = () => {
        if (!selectedRequest) return;
        const result = openReplyByEmail({
            email: selectedRequest.email,
            name: selectedRequest.name,
            message: selectedRequest.message,
        });

        if (!result.ok) {
            if (result.gmailUrl) {
                window.open(result.gmailUrl, '_blank', 'noopener,noreferrer');
                toast.info('Opened Gmail compose (no default mail app detected).');
            } else {
                toast.error(result.error || 'Could not start email reply.');
            }
            return;
        }

        toast.info(
            <span>
                Opening your email app for <strong>{selectedRequest.email}</strong>.
                {result.gmailUrl && (
                    <>
                        {' '}
                        <button
                            type="button"
                            className="btn btn-link btn-sm p-0 align-baseline text-white"
                            onClick={() => window.open(result.gmailUrl, '_blank', 'noopener,noreferrer')}
                        >
                            Use Gmail instead
                        </button>
                    </>
                )}
            </span>,
            { autoClose: 10000 }
        );
    };

    if (loading && requests.length === 0) {
        return (
            <div className="p-100 text-center text-white">
                <div className="spinner-border text-primary"></div>
                <p className="mt-3">Loading inbox…</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-50 text-danger text-center glass-panel m-50">
                <h4>Inbox error</h4>
                <p>{error}</p>
                <button className="btn btn-primary mt-3" onClick={() => refresh()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in inbox-page">
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
                <div>
                    <h1 className="inbox-page-title mb-2 fw-800 fs-1" style={{ letterSpacing: '-1.5px' }}>
                        Client Inbox
                    </h1>
                    <p className="text-muted m-0 fs-6">
                        Manage leads, reply faster, and track project inquiries.
                    </p>
                </div>
                <div className="d-flex gap-2 flex-wrap">
                    <button type="button" className="inbox-btn-secondary" onClick={() => refresh()}>
                        <i className="fas fa-sync-alt me-1"></i> Refresh
                    </button>
                    {(stats?.unread ?? 0) > 0 && (
                        <button type="button" className="inbox-btn-secondary" onClick={handleMarkAllRead}>
                            <i className="fas fa-check-double me-1"></i> Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-4">
                {[
                    { label: 'Total', val: stats?.total ?? 0, color: 'var(--admin-accent)', icon: 'fa-inbox' },
                    { label: 'New', val: stats?.new ?? 0, color: '#a78bfa', icon: 'fa-star' },
                    { label: 'In Progress', val: stats?.inProgress ?? 0, color: '#60a5fa', icon: 'fa-comments' },
                    { label: 'Unread', val: stats?.unread ?? 0, color: '#f43f5e', icon: 'fa-envelope' },
                ].map((s) => (
                    <div key={s.label} className="col-6 col-lg-3">
                        <div className="inbox-stat-card">
                            <div className="inbox-stat-icon" style={{ background: `${s.color}22`, color: s.color }}>
                                <i className={`fas ${s.icon}`}></i>
                            </div>
                            <div>
                                <div className="text-muted fs-11 text-uppercase fw-700">{s.label}</div>
                                <div className="inbox-page-title fw-800 fs-3">{s.val}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Toolbar */}
            <div className="inbox-toolbar glass-panel p-3 mb-4">
                <div className="row g-3 align-items-center">
                    <div className="col-lg-5">
                        <div className="inbox-search-wrap">
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="Search name, email, phone, telegram, budget, message…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="d-flex flex-wrap gap-2">
                            {STATUS_TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className={`inbox-tab ${statusFilter === tab.key ? 'active' : ''}`}
                                    onClick={() => setStatusFilter(tab.key)}
                                >
                                    {tab.label}
                                    {tab.key === 'New' && (stats?.new ?? 0) > 0 && (
                                        <span className="inbox-tab-badge">{stats?.new}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-3 d-flex gap-2 justify-content-lg-end">
                        <select
                            className="inbox-select"
                            value={sort}
                            onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
                        >
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                        <label className="inbox-unread-toggle">
                            <input
                                type="checkbox"
                                checked={unreadOnly}
                                onChange={(e) => setUnreadOnly(e.target.checked)}
                            />
                            <span>Unread only</span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="row g-4 inbox-layout">
                <div className="col-xl-4 col-lg-5">
                    <div className="glass-panel inbox-list-panel">
                        <div className="inbox-list-header">
                            <h6 className="m-0 inbox-page-title fw-700">Messages</h6>
                            <span className="inbox-count-pill" title={statusFilter !== 'all' ? `Filtered: ${statusFilter}` : undefined}>
                                {requests.length}
                            </span>
                        </div>
                        <div className="inbox-list-body custom-scrollbar">
                            {requests.length === 0 ? (
                                <div className="p-5 text-center text-muted">
                                    <i className="fas fa-inbox fs-1 mb-3 opacity-25"></i>
                                    <p className="fs-13 mb-0">No messages match your filters.</p>
                                </div>
                            ) : (
                                requests.map((req) => (
                                    <button
                                        key={req.id}
                                        type="button"
                                        className={`inbox-item ${selectedId === req.id ? 'active' : ''} ${!req.isRead ? 'unread' : ''}`}
                                        onClick={() => handleSelect(req)}
                                    >
                                        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                                            <span className={`inbox-status ${req.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                {req.status}
                                            </span>
                                            <span className="text-muted fs-10">{formatRelativeTime(req.createdAt)}</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            {!req.isRead && <span className="inbox-unread-dot" />}
                                            <h6 className="m-0 inbox-page-title fw-700 text-start">{req.name}</h6>
                                        </div>
                                        <p className="m-0 text-muted fs-11 text-truncate text-start mt-1">{req.message}</p>
                                        <div className="d-flex flex-wrap gap-2 align-items-center mt-1">
                                            {req.budgetRange && (
                                                <span className="inbox-budget-chip">{req.budgetRange}</span>
                                            )}
                                            <p className="m-0 text-muted fs-10 text-start opacity-75">{req.email}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-xl-8 col-lg-7">
                    <div className="glass-panel inbox-detail-panel">
                        {selectedRequest ? (
                            <div className="p-4 p-lg-5">
                                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
                                    <div>
                                        <div className="inbox-detail-label">Client inquiry</div>
                                        <h2 className="inbox-page-title fw-900 mb-2">{selectedRequest.name}</h2>
                                        <div className="d-flex flex-wrap gap-3">
                                            <button
                                                type="button"
                                                className="inbox-link-btn"
                                                onClick={() => copyToClipboard(selectedRequest.email, 'Email')}
                                            >
                                                <i className="fas fa-envelope me-1"></i>
                                                {selectedRequest.email}
                                            </button>
                                            {selectedRequest.phone && (
                                                <button
                                                    type="button"
                                                    className="inbox-link-btn"
                                                    onClick={() => copyToClipboard(selectedRequest.phone!, 'Phone')}
                                                >
                                                    <i className="fas fa-phone me-1"></i>
                                                    {selectedRequest.phone}
                                                </button>
                                            )}
                                            {selectedRequest.telegram && (
                                                <button
                                                    type="button"
                                                    className="inbox-link-btn"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            selectedRequest.telegram!.startsWith('@')
                                                                ? selectedRequest.telegram!
                                                                : `@${selectedRequest.telegram}`,
                                                            'Telegram'
                                                        )
                                                    }
                                                >
                                                    <i className="fab fa-telegram-plane me-1"></i>
                                                    {selectedRequest.telegram.startsWith('@')
                                                        ? selectedRequest.telegram
                                                        : `@${selectedRequest.telegram}`}
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-muted fs-11 mt-2 mb-0">
                                            Received {new Date(selectedRequest.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="d-flex flex-column gap-2 align-items-stretch" style={{ minWidth: '180px' }}>
                                        <label className="inbox-field-label">Status</label>
                                        <select
                                            className="inbox-select w-100"
                                            value={selectedRequest.status}
                                            onChange={(e) => handleStatusChange(selectedRequest.id, e.target.value)}
                                        >
                                            <option value="New">New</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    <button
                                        type="button"
                                        className="inbox-action-btn primary"
                                        onClick={handleReplyByEmail}
                                    >
                                        <i className="fas fa-reply me-1"></i> Reply by email
                                    </button>
                                    {selectedTelegramUrl ? (
                                        <a
                                            href={selectedTelegramUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inbox-action-btn telegram"
                                        >
                                            <i className="fab fa-telegram-plane me-1"></i> Message on Telegram
                                        </a>
                                    ) : (
                                        <a
                                            href={COMPANY_TELEGRAM_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inbox-action-btn telegram"
                                        >
                                            <i className="fab fa-telegram-plane me-1"></i> Open Telegram Support
                                        </a>
                                    )}
                                    {selectedRequest.phone && (
                                        <a href={`tel:${selectedRequest.phone}`} className="inbox-action-btn">
                                            <i className="fas fa-phone me-1"></i> Call
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        className="inbox-action-btn danger"
                                        onClick={handleDelete}
                                    >
                                        <i className="fas fa-trash me-1"></i> Delete
                                    </button>
                                </div>

                                <div className="row g-3 mb-4">
                                    <div className="col-md-6 col-lg-3">
                                        <div className="inbox-info-box">
                                            <label>Project type</label>
                                            <p>{selectedRequest.projectType || 'Website inquiry'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="inbox-info-box">
                                            <label>Budget</label>
                                            <p className="text-accent">{selectedRequest.budgetRange || 'Not specified'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="inbox-info-box">
                                            <label>Phone</label>
                                            <p>{selectedRequest.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <div className="inbox-info-box">
                                            <label>Telegram</label>
                                            <p>
                                                {selectedRequest.telegram
                                                    ? selectedRequest.telegram.startsWith('@')
                                                        ? selectedRequest.telegram
                                                        : `@${selectedRequest.telegram}`
                                                    : 'Not provided'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="inbox-field-label">Message</label>
                                    <div className="inbox-message-box">{selectedRequest.message}</div>
                                </div>

                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="inbox-field-label m-0">Internal notes</label>
                                        <button type="button" className="inbox-btn-save" onClick={handleSaveNotes}>
                                            Save notes
                                        </button>
                                    </div>
                                    <textarea
                                        className="inbox-notes"
                                        rows={5}
                                        placeholder="Private notes for your team…"
                                        value={notesDraft}
                                        onChange={(e) => setNotesDraft(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="inbox-empty-detail">
                                <i className="fas fa-envelope-open-text"></i>
                                <h4 className="inbox-page-title fw-800">Select a message</h4>
                                <p className="text-muted fs-13">Choose a client inquiry from the list to view details and respond.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .inbox-page-title { color: var(--admin-text-main); }
                .inbox-budget-chip {
                    font-size: 10px;
                    font-weight: 700;
                    padding: 3px 8px;
                    border-radius: 6px;
                    background: rgba(var(--sp-primary-rgb), 0.12);
                    color: var(--admin-accent);
                    border: 1px solid rgba(var(--sp-primary-rgb), 0.25);
                }
                .inbox-layout { min-height: calc(100vh - 380px); }
                .inbox-stat-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 18px 20px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 16px;
                }
                .inbox-stat-icon {
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
                .inbox-toolbar { border: 1px solid var(--admin-glass-border); }
                .inbox-search-wrap {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--admin-bg-alt);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 12px;
                    padding: 10px 16px;
                }
                .inbox-search-wrap i { color: var(--admin-text-muted); }
                .inbox-search-wrap input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: var(--admin-text-main);
                    font-size: 14px;
                }
                .inbox-tab {
                    border: 1px solid var(--admin-glass-border);
                    background: transparent;
                    color: var(--admin-text-muted);
                    border-radius: 999px;
                    padding: 8px 14px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }
                .inbox-tab.active {
                    background: var(--admin-accent);
                    border-color: var(--admin-accent);
                    color: #0f172a;
                }
                .inbox-tab-badge {
                    background: rgba(255,255,255,0.2);
                    padding: 2px 7px;
                    border-radius: 999px;
                    font-size: 10px;
                }
                .inbox-select {
                    background: var(--admin-bg-alt);
                    border: 1px solid var(--admin-glass-border);
                    color: var(--admin-text-main);
                    border-radius: 10px;
                    padding: 8px 12px;
                    font-size: 13px;
                }
                .inbox-unread-toggle {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: var(--admin-text-muted);
                    font-size: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    white-space: nowrap;
                }
                .inbox-btn-secondary {
                    background: rgba(var(--sp-primary-rgb), 0.06);
                    border: 1px solid var(--admin-glass-border);
                    color: var(--admin-text-main);
                    border-radius: 10px;
                    padding: 10px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }
                .inbox-list-panel, .inbox-detail-panel {
                    height: 100%;
                    min-height: 520px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    padding: 0;
                }
                .inbox-list-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--admin-glass-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .inbox-count-pill {
                    background: rgba(var(--sp-primary-rgb), 0.15);
                    color: var(--admin-accent);
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 11px;
                    font-weight: 800;
                }
                .inbox-list-body {
                    flex: 1;
                    overflow-y: auto;
                }
                .inbox-item {
                    width: 100%;
                    text-align: left;
                    border: none;
                    border-bottom: 1px solid var(--admin-glass-border);
                    background: transparent;
                    padding: 16px 20px;
                    cursor: pointer;
                    transition: background 0.2s;
                    border-left: 3px solid transparent;
                }
                .inbox-item:hover { background: rgba(255,255,255,0.02); }
                .inbox-item.active {
                    background: rgba(var(--sp-primary-rgb), 0.1);
                    border-left-color: var(--admin-accent);
                }
                .inbox-item.unread { background: rgba(var(--sp-primary-rgb), 0.05); }
                .inbox-unread-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #f43f5e;
                    flex-shrink: 0;
                    box-shadow: 0 0 8px #f43f5e;
                }
                .inbox-status {
                    font-size: 9px;
                    font-weight: 800;
                    padding: 3px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .inbox-status.new { background: rgba(var(--sp-primary-rgb), 0.2); color: #b45309; }
                html[data-theme="dark"] .inbox-status.new { color: #fcd34d; }
                .inbox-status.in-progress { background: rgba(59,130,246,0.2); color: #93c5fd; }
                .inbox-status.closed { background: rgba(16,185,129,0.2); color: #6ee7b7; }
                .inbox-detail-label {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: var(--admin-accent);
                    margin-bottom: 8px;
                }
                .inbox-link-btn {
                    background: none;
                    border: none;
                    color: var(--admin-text-muted);
                    font-size: 13px;
                    padding: 0;
                    cursor: pointer;
                }
                .inbox-link-btn:hover { color: var(--admin-accent); }
                .inbox-field-label {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    color: var(--admin-accent);
                }
                .inbox-action-btn {
                    display: inline-flex;
                    align-items: center;
                    padding: 10px 16px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 700;
                    text-decoration: none;
                    border: 1px solid var(--admin-glass-border);
                    background: rgba(var(--sp-primary-rgb), 0.05);
                    color: var(--admin-text-main);
                    cursor: pointer;
                    font-family: inherit;
                }
                button.inbox-action-btn {
                    appearance: none;
                }
                .inbox-action-btn.primary {
                    background: var(--admin-accent);
                    border-color: var(--admin-accent);
                    color: #0f172a;
                }
                .inbox-action-btn.telegram {
                    background: #229ED9;
                    border-color: #229ED9;
                }
                .inbox-action-btn.danger {
                    color: #fb7185;
                    border-color: rgba(244,63,94,0.3);
                }
                .inbox-info-box {
                    background: rgba(255,255,255,0.02);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 14px;
                    padding: 16px;
                }
                .inbox-info-box label {
                    font-size: 10px;
                    text-transform: uppercase;
                    font-weight: 800;
                    color: #64748b;
                    display: block;
                    margin-bottom: 6px;
                }
                .inbox-info-box p {
                    margin: 0;
                    color: var(--admin-text-main);
                    font-weight: 600;
                }
                .inbox-info-box .text-accent { color: var(--admin-accent); }
                .inbox-message-box {
                    background: var(--admin-bg-alt);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 14px;
                    padding: 20px;
                    color: var(--admin-text-lighter);
                    line-height: 1.75;
                    white-space: pre-wrap;
                    font-size: 14px;
                }
                .inbox-notes {
                    width: 100%;
                    background: var(--admin-bg-alt);
                    border: 1px solid var(--admin-glass-border);
                    border-radius: 14px;
                    color: var(--admin-text-main);
                    padding: 16px;
                    resize: vertical;
                }
                .inbox-btn-save {
                    background: rgba(var(--sp-primary-rgb), 0.15);
                    border: 1px solid var(--admin-accent);
                    color: var(--admin-text-main);
                    border-radius: 8px;
                    padding: 6px 14px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }
                .inbox-empty-detail {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 480px;
                    text-align: center;
                    padding: 40px;
                }
                .inbox-empty-detail i {
                    font-size: 48px;
                    color: var(--admin-accent);
                    opacity: 0.35;
                    margin-bottom: 20px;
                }
            `}</style>
        </div>
    );
};

export default RequestsInbox;
