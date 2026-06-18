import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export interface SocialAccount {
    id: number;
    platform: string;
    value: string;
    icon: string;
    link: string;
    isVisible: boolean;
    sortOrder: number;
}

export const useSocialAccounts = () => {
    const [accounts, setAccounts] = useState<SocialAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAccounts = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getSocialAccounts();
            const rawList = Array.isArray(data) ? data : (data?.data || []);
            
            // Map safely to support both PascalCase from .NET and camelCase
            const mappedList: SocialAccount[] = rawList.map((a: any) => ({
                id: a.id ?? a.Id ?? 0,
                platform: a.platform || a.Platform || '',
                value: a.value || a.Value || '',
                icon: a.icon || a.Icon || '',
                link: a.link || a.Link || '',
                isVisible: a.isVisible ?? a.IsVisible ?? true,
                sortOrder: a.sortOrder ?? a.SortOrder ?? 0
            }));

            // Sort by sortOrder ascending
            const sorted = mappedList.sort((a, b) => a.sortOrder - b.sortOrder);
            setAccounts(sorted);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch social accounts');
            console.error("Failed to fetch social accounts:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return { accounts, setAccounts, loading, error, refetch: fetchAccounts };
};
