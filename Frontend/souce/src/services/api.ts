import { apiClient as api } from '../lib/apiClient';

// Generic API Service
export const apiService = {
    // Projects
    getProjects: () => api.get('/projects'),
    getProject: (id: string) => api.get(`/projects/${id}`),
    createProject: (data: any) => api.post('/projects', data),
    updateProject: (id: string, data: any) => api.put(`/projects/${id}`, data),
    deleteProject: (id: string) => api.delete(`/projects/${id}`),

    // Resume (experience & education)
    getResumeEntries: (params?: {
        type?: 'experience' | 'education';
        includeInactive?: boolean;
    }) => api.get('/resume', { params }),
    getResumeEntry: (id: string | number) => api.get(`/resume/${id}`),
    addResumeEntry: (data: Record<string, unknown>) => api.post('/resume', data),
    updateResumeEntry: (id: string | number, data: Record<string, unknown>) =>
        api.put(`/resume/${id}`, data),
    deleteResumeEntry: (id: string | number) => api.delete(`/resume/${id}`),

    // Team
    getTeam: () => api.get('/team'),
    getTeamMember: (id: string | number) => api.get(`/team/${id}`),
    addTeamMember: (data: any) => api.post('/team', data),
    updateTeamMember: (id: string | number, data: any) => api.put(`/team/${id}`, data),
    deleteTeamMember: (id: string | number) => api.delete(`/team/${id}`),

    // Reviews
    getReviews: () => api.get('/reviews'),
    createReview: (data: any) => api.post('/reviews', data),
    updateReview: (id: string, data: any) => api.put(`/reviews/${id}`, data),
    deleteReview: (id: string) => api.delete(`/reviews/${id}`),

    // Inbox
    getInboxStats: () => api.get('/inbox/stats'),
    getMessages: (params?: {
        status?: string;
        search?: string;
        sort?: string;
        unreadOnly?: boolean;
        includeStats?: boolean;
    }) => api.get('/inbox', { params }),
    sendMessage: (data: any) => api.post('/inbox', data),
    updateMessage: (id: string, data: any) => api.put(`/inbox/${id}`, data),
    markInboxRead: (id: string, read = true) =>
        api.put(`/inbox/${id}`, { isRead: read }),
    markAllInboxRead: () => api.post('/inbox/mark-all-read'),
    deleteMessage: (id: string) => api.delete(`/inbox/${id}`),

    // Pricing
    getPricing: () => api.get('/pricing'),
    createPricing: (data: any) => api.post('/pricing', data),
    updatePricing: (id: string, data: any) => api.put(`/pricing/${id}`, data),

    // Videos (Showreel)
    getVideos: () => api.get('/videos'),
    getVideo: (id: string) => api.get(`/videos/${id}`),
    createVideo: (data: any) => api.post('/videos', data),
    updateVideo: (id: string, data: any) => api.put(`/videos/${id}`, data),
    deleteVideo: (id: string) => api.delete(`/videos/${id}`),

    // Services
    getServices: () => api.get('/services'),
    getService: (id: string) => api.get(`/services/${id}`),
    createService: (data: any) => api.post('/services', data),
    updateService: (id: string, data: any) => api.put(`/services/${id}`, data),
    deleteService: (id: string) => api.delete(`/services/${id}`),

    // Video Categories
    getCategories: () => api.get('/VideoCategories'),
    getCategory: (id: string) => api.get(`/VideoCategories/${id}`),
    createCategory: (data: any) => api.post('/VideoCategories', data),
    updateCategory: (id: string, data: any) => api.put(`/VideoCategories/${id}`, data),
    deleteCategory: (id: string) => api.delete(`/VideoCategories/${id}`),

    // Social & Contact Accounts
    getSocialAccounts: () => api.get('/SocialAccounts'),
    getSocialAccount: (id: string | number) => api.get(`/SocialAccounts/${id}`),
    createSocialAccount: (data: any) => api.post('/SocialAccounts', data),
    updateSocialAccount: (id: string | number, data: any) => api.put(`/SocialAccounts/${id}`, data),
    deleteSocialAccount: (id: string | number) => api.delete(`/SocialAccounts/${id}`),

    // Site Settings
    getSettings: () => api.get('/SiteSettings'),
    updateSettings: (id: string, data: any) => api.put(`/SiteSettings/${id}`, data),

    // Visitor Analytics
    logVisit: (data: {
        country?: string;
        countryCode?: string;
        city?: string;
        region?: string;
        page?: string;
        section?: string;
        sessionId?: string;
    }) => api.post('/visitors', data),
    getVisitorStats: (params?: {
        country?: string;
        city?: string;
        page?: string;
        section?: string;
        dateFrom?: string;
        dateTo?: string;
        period?: string;
    }) => api.get('/visitors/stats', { params }),
    getVisitorFilterOptions: (params?: { country?: string }) =>
        api.get('/visitors/filter-options', { params }),

    // Auth
    login: (data: any) => api.post('/auth/login', data),
    verifyToken: () => api.get('/auth/verify'),
    updateProfile: (id: string, data: any) => api.put(`/auth?id=${id}`, data),
    updatePassword: (id: string, data: any) => api.put(`/auth/UpdateRegisterUserPassword?id=${id}`, data),
};

export default api;
