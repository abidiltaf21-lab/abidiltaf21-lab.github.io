import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService } from '../services/api';
import {
    type ClientRequest,
    type InboxStats,
    computeStatsFromRequests,
    normalizeStats,
    parseInboxList,
} from '../hooks/useRequests';
import { INBOX_UPDATED_EVENT } from '../utils/inboxEvents';

interface InboxNotificationContextValue {
    stats: InboxStats | null;
    recentUnread: ClientRequest[];
    refresh: () => Promise<void>;
    requestNotificationPermission: () => Promise<boolean>;
    notificationsEnabled: boolean;
}

const InboxNotificationContext = createContext<InboxNotificationContextValue | null>(null);

export { InboxNotificationContext };

const POLL_MS = 8000;

export const InboxNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [stats, setStats] = useState<InboxStats | null>(null);
    const [recentUnread, setRecentUnread] = useState<ClientRequest[]>([]);
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        () => typeof Notification !== 'undefined' && Notification.permission === 'granted'
    );
    const prevUnreadRef = useRef<number | null>(null);
    const isInboxPage = location.pathname.includes('/admin/requests');

    const showBrowserNotification = useCallback((title: string, body: string) => {
        if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
        if (isInboxPage) return;
        try {
            new Notification(title, {
                body,
                icon: '/favicon.ico',
                tag: 'smooothpixel-inbox',
            });
        } catch {
            // ignore
        }
    }, [isInboxPage]);

    const refresh = useCallback(async () => {
        try {
            let allMessages: ClientRequest[] = [];

            const listRes = await apiService.getMessages({ sort: 'newest', includeStats: true });
            allMessages = parseInboxList(listRes.data);

            const unreadOnly = allMessages.filter((r) => !r.isRead);
            const nextUnread = unreadOnly.length;

            let baseStats: InboxStats;
            if (
                listRes.data &&
                typeof listRes.data === 'object' &&
                !Array.isArray(listRes.data) &&
                'stats' in listRes.data
            ) {
                baseStats = normalizeStats((listRes.data as { stats: Record<string, unknown> }).stats);
            } else {
                try {
                    const statsRes = await apiService.getInboxStats();
                    baseStats = normalizeStats(statsRes.data);
                } catch {
                    baseStats = computeStatsFromRequests(allMessages);
                }
            }
            setStats({ ...baseStats, unread: nextUnread });
            setRecentUnread(unreadOnly.slice(0, 6));
            if (prevUnreadRef.current !== null && nextUnread > prevUnreadRef.current) {
                const delta = nextUnread - prevUnreadRef.current;
                const latest = unreadOnly[0];
                showBrowserNotification(
                    'New client message',
                    latest
                        ? `${latest.name}: ${latest.message.slice(0, 80)}${latest.message.length > 80 ? '…' : ''}`
                        : `${delta} new unread message(s) in Client Inbox`
                );
            }
            prevUnreadRef.current = nextUnread;
        } catch {
            // silent — header still usable
        }
    }, [showBrowserNotification]);

    const requestNotificationPermission = useCallback(async () => {
        if (typeof Notification === 'undefined') return false;
        const result = await Notification.requestPermission();
        const granted = result === 'granted';
        setNotificationsEnabled(granted);
        return granted;
    }, []);

    useEffect(() => {
        refresh();
        const interval = window.setInterval(refresh, POLL_MS);
        const onFocus = () => refresh();
        const onVisible = () => {
            if (document.visibilityState === 'visible') refresh();
        };
        const onInboxUpdated = () => refresh();
        window.addEventListener('focus', onFocus);
        document.addEventListener('visibilitychange', onVisible);
        window.addEventListener(INBOX_UPDATED_EVENT, onInboxUpdated);
        return () => {
            window.clearInterval(interval);
            window.removeEventListener('focus', onFocus);
            document.removeEventListener('visibilitychange', onVisible);
            window.removeEventListener(INBOX_UPDATED_EVENT, onInboxUpdated);
        };
    }, [refresh]);

    return (
        <InboxNotificationContext.Provider
            value={{
                stats,
                recentUnread,
                refresh,
                requestNotificationPermission,
                notificationsEnabled,
            }}
        >
            {children}
        </InboxNotificationContext.Provider>
    );
};

export default InboxNotificationProvider;
