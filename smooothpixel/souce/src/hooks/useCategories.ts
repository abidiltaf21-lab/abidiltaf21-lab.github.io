import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useCategories = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getCategories();
            // Assuming categories is returned as an array or inside a data property
            const categoriesList = Array.isArray(data) ? data : (data?.data || []);
            // Sort categories by SortOrder or Name
            const sorted = categoriesList.sort((a: any, b: any) => {
                if (a.sortOrder !== b.sortOrder) return (a.sortOrder || 0) - (b.sortOrder || 0);
                return (a.name || a.Name || '').localeCompare(b.name || b.Name || '');
            });
            setCategories(sorted);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
            console.error("Failed to fetch categories:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, setCategories, loading, error, refetch: fetchCategories };
};
