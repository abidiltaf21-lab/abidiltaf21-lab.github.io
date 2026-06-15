import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { apiService } from '../services/api';
import { notifyInboxUpdated } from '../utils/inboxEvents';
import { buildInboxPatchBody, buildLegacyInboxPutBody } from '../utils/inboxUpdate';

export interface ClientRequest {
    id: number;
    name: string;
    email: string;
    phone?: string;
    telegram?: string;
    budgetRange?: string;
    projectType?: string;
    message: string;
    status: string;
    isRead?: boolean;
    internalNotes?: string;
    createdAt: string;
}

export interface InboxStats {
    total: number;
    new: number;
    inProgress: number;
    closed: number;
    unread: number;
}

export interface InboxFilters {
    status: string;
    search: string;
    sort: 'newest' | 'oldest';
    unreadOnly: boolean;
}

/** When API omits isRead (older backend), treat non-New status as handled. */
export function resolveInboxIsRead(raw: Record<string, unknown>): boolean {
    if (raw.isRead !== undefined || raw.IsRead !== undefined) {
        return Boolean(raw.isRead ?? raw.IsRead);
    }
    const status = String(raw.status ?? raw.Status ?? 'New').trim().toLowerCase();
    return status !== 'new';
}

export const normalizeRequest = (raw: Record<string, unknown>): ClientRequest => ({
    id: Number(raw.id ?? raw.Id),
    name: String(raw.name ?? raw.Name ?? ''),
    email: String(raw.email ?? raw.Email ?? ''),
    phone: (raw.phone ?? raw.Phone) as string | undefined,
    telegram: (raw.telegram ?? raw.Telegram) as string | undefined,
    budgetRange: (raw.budgetRange ?? raw.BudgetRange) as string | undefined,
    projectType: (raw.projectType ?? raw.ProjectType) as string | undefined,
    message: String(raw.message ?? raw.Message ?? ''),
    status: String(raw.status ?? raw.Status ?? 'New'),
    isRead: resolveInboxIsRead(raw),
    internalNotes: (raw.internalNotes ?? raw.InternalNotes) as string | undefined,
    createdAt: String(raw.createdAt ?? raw.CreatedAt ?? new Date().toISOString()),
});

export const normalizeStats = (raw: Record<string, unknown>): InboxStats => ({
    total: Number(raw.total ?? 0),
    new: Number(raw.new ?? raw.New ?? 0),
    inProgress: Number(raw.inProgress ?? raw.InProgress ?? 0),
    closed: Number(raw.closed ?? raw.Closed ?? 0),
    unread: Number(raw.unread ?? raw.Unread ?? 0),
});

export const computeStatsFromRequests = (list: ClientRequest[]): InboxStats => ({
    total: list.length,
    new: list.filter((r) => r.status.toLowerCase() === 'new').length,
    inProgress: list.filter((r) => r.status.toLowerCase() === 'in progress').length,
    closed: list.filter((r) => r.status.toLowerCase() === 'closed').length,
    unread: list.filter((r) => !r.isRead).length,
});

export const parseInboxList = (data: unknown): ClientRequest[] => {
    const rows = Array.isArray(data)
        ? data
        : data && typeof data === 'object' && Array.isArray((data as { items?: unknown }).items)
          ? (data as { items: Record<string, unknown>[] }).items
          : [];
    return rows.map((item) => normalizeRequest(item as Record<string, unknown>));
};

const parseInboxStats = (data: unknown, listFallback: ClientRequest[]): InboxStats => {
    if (data && typeof data === 'object' && 'stats' in data) {
        return normalizeStats((data as { stats: Record<string, unknown> }).stats);
    }
    if (data && typeof data === 'object' && 'total' in data) {
        return normalizeStats(data as Record<string, unknown>);
    }
    return computeStatsFromRequests(listFallback);
};

async function putInboxUpdate(
    id: number,
    current: ClientRequest,
    patch: { status?: string; internalNotes?: string; isRead?: boolean }
) {
    try {
        await apiService.updateMessage(id.toString(), buildInboxPatchBody(patch));
    } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 400) {
            await apiService.updateMessage(id.toString(), buildLegacyInboxPutBody(current, patch));
            return;
        }
        throw err;
    }
}

/** Client-side filter (fallback when API ignores query params). */
export function applyInboxFilters(list: ClientRequest[], filters?: InboxFilters): ClientRequest[] {
    let result = [...list];

    if (filters?.status && filters.status !== 'all') {
        const want = filters.status.trim().toLowerCase();
        result = result.filter((r) => r.status.trim().toLowerCase() === want);
    }

    if (filters?.unreadOnly) {
        result = result.filter((r) => !r.isRead);
    }

    if (filters?.search?.trim()) {
        const term = filters.search.trim().toLowerCase();
        result = result.filter(
            (r) =>
                r.name.toLowerCase().includes(term) ||
                r.email.toLowerCase().includes(term) ||
                (r.phone?.toLowerCase().includes(term) ?? false) ||
                (r.telegram?.toLowerCase().includes(term) ?? false) ||
                r.message.toLowerCase().includes(term) ||
                (r.projectType?.toLowerCase().includes(term) ?? false) ||
                (r.budgetRange?.toLowerCase().includes(term) ?? false)
        );
    }

    result.sort((a, b) => {
        const ta = new Date(a.createdAt).getTime();
        const tb = new Date(b.createdAt).getTime();
        return filters?.sort === 'oldest' ? ta - tb : tb - ta;
    });

    return result;
}

/** Stats without /inbox/stats (avoids 405 when old API maps "stats" to PUT {id}). */
const fetchInboxStatsSafe = async (): Promise<InboxStats> => {
    try {
        const { data } = await apiService.getInboxStats();
        return normalizeStats(data);
    } catch {
        const { data } = await apiService.getMessages();
        const list = parseInboxList(data);
        return computeStatsFromRequests(list);
    }
};

export const useRequests = (filters?: InboxFilters, autoRefreshMs = 0) => {
    const [requests, setRequests] = useState<ClientRequest[]>([]);
    const [stats, setStats] = useState<InboxStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        const next = await fetchInboxStatsSafe();
        setStats(next);
        return next;
    }, []);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params: Record<string, string | boolean> = { includeStats: true };
            if (filters?.status && filters.status !== 'all') params.status = filters.status;
            if (filters?.search?.trim()) params.search = filters.search.trim();
            if (filters?.sort) params.sort = filters.sort;
            if (filters?.unreadOnly) params.unreadOnly = true;

            const listRes = await apiService.getMessages(params);
            const parsed = parseInboxList(listRes.data);
            const list = applyInboxFilters(parsed, filters);

            if (
                listRes.data &&
                typeof listRes.data === 'object' &&
                !Array.isArray(listRes.data) &&
                'stats' in listRes.data
            ) {
                setStats(parseInboxStats(listRes.data, parsed));
            } else {
                setStats(await fetchInboxStatsSafe());
            }

            setRequests(list);
        } catch (err: unknown) {
            const axiosErr = err as { response?: { status?: number }; message?: string };
            const status = axiosErr.response?.status;
            const detail =
                (axiosErr as { response?: { data?: { detail?: string; message?: string } } }).response?.data
                    ?.detail ||
                (axiosErr as { response?: { data?: { detail?: string; message?: string } } }).response?.data
                    ?.message;
            const message =
                status === 500 && detail?.includes('Invalid column name')
                    ? 'Database is missing inbox columns. Stop ReactApi in Visual Studio, rebuild, and start again — then click Retry.'
                    : status === 500
                      ? detail || 'Server error loading inbox. Restart ReactApi and click Retry.'
                      : status === 405
                        ? 'Inbox API is out of date. Restart the ReactApi backend in Visual Studio, then click Retry.'
                        : detail || axiosErr.message || 'Failed to fetch inbox.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [filters?.status, filters?.search, filters?.sort, filters?.unreadOnly]);

    const updateRequestStatus = async (id: number, status: string) => {
        const current = requests.find((r) => r.id === id);
        if (!current) throw new Error('Message not found');
        await putInboxUpdate(id, current, { status });
        setRequests((prev) =>
            applyInboxFilters(
                prev.map((r) => (r.id === id ? { ...r, status } : r)),
                filters
            )
        );
        await fetchStats();
        notifyInboxUpdated();
    };

    const updateInternalNotes = async (id: number, notes: string) => {
        const current = requests.find((r) => r.id === id);
        if (!current) throw new Error('Message not found');
        await putInboxUpdate(id, current, { internalNotes: notes });
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, internalNotes: notes } : r)));
        notifyInboxUpdated();
    };

    const markAsRead = async (id: number, read = true) => {
        const current = requests.find((r) => r.id === id);
        if (!current) throw new Error('Message not found');
        await putInboxUpdate(id, current, { isRead: read });
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, isRead: read } : r)));
        await fetchStats();
        notifyInboxUpdated();
    };

    const markAllRead = async () => {
        const unread = requests.filter((r) => !r.isRead);
        try {
            await apiService.markAllInboxRead();
        } catch {
            await Promise.all(unread.map((r) => putInboxUpdate(r.id, r, { isRead: true })));
        }
        setRequests((prev) => prev.map((r) => ({ ...r, isRead: true })));
        await fetchStats();
        notifyInboxUpdated();
    };

    const deleteRequest = async (id: number) => {
        await apiService.deleteMessage(id.toString());
        setRequests((prev) => applyInboxFilters(prev.filter((r) => r.id !== id), filters));
        await fetchStats();
        notifyInboxUpdated();
    };

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        if (!autoRefreshMs) return;
        const interval = window.setInterval(() => {
            fetchRequests();
        }, autoRefreshMs);
        return () => window.clearInterval(interval);
    }, [autoRefreshMs, fetchRequests]);

    return {
        requests,
        stats,
        loading,
        error,
        refresh: fetchRequests,
        fetchStats,
        updateRequestStatus,
        updateInternalNotes,
        markAsRead,
        markAllRead,
        deleteRequest,
    };
};
