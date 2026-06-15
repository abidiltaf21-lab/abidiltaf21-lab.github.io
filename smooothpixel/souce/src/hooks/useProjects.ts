import { useEffect, useState } from 'react';
import { apiService } from '../services/api';

export interface Project {
    id: string; // Changed to string for MongoDB compatibility
    title: string;
    description: string;
    videoUrl?: string;
    thumb?: string;
    thumbFull?: string;
    tags: string[];
    views?: number;
    clientName?: string;
    projectDate?: string;
    duration?: string;
    isFeatured?: boolean;
    visibility?: string;
}

// Function to convert API response to Frontend model
const mapProject = (p: any): Project => {
    // Normalization helper
    const getProp = (obj: any, prop: string) => obj[prop] || obj[prop.charAt(0).toUpperCase() + prop.slice(1)] || '';
    
    const id = p.id || p.Id || p.ID || p._id || '0';
    
    return {
        ...p,
        id: String(id),
        title: getProp(p, 'title'),
        description: getProp(p, 'description'),
        videoUrl: getProp(p, 'videoUrl'),
        thumb: getProp(p, 'thumb'),
        thumbFull: getProp(p, 'thumbFull'),
        tags: Array.isArray(p.tags) ? p.tags : (p.Tags ? String(p.Tags).split(',').map((t: string) => t.trim()) : (p.tags ? String(p.tags).split(',').map((t: string) => t.trim()) : [])),
        views: p.views ?? p.Views ?? 0,
        clientName: getProp(p, 'clientName'),
        projectDate: getProp(p, 'projectDate'),
        duration: getProp(p, 'duration'),
        isFeatured: p.isFeatured ?? p.IsFeatured ?? false,
        visibility: getProp(p, 'visibility') || 'public',
    };
};

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await apiService.getProjects();
            setProjects(data.map(mapProject));
        } catch (err: any) {
            setError(err.message || "Failed to fetch projects from API.");
        } finally {
            setLoading(false);
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await apiService.deleteProject(id);
            setProjects(prev => prev.filter(p => p.id !== id));
            return { error: null };
        } catch (err: any) {
            return { error: err };
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return { projects, loading, error, refresh: fetchProjects, deleteProject };
};

export const useProject = (id: string) => {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                const { data } = await apiService.getProject(id);
                setProject(data ? mapProject(data) : null);
            } catch (err: any) {
                setError(err.message || "Failed to fetch project details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    return { project, loading, error };
};

