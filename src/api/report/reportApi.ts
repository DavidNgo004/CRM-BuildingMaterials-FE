import axiosClient from '../axiosClient';

export interface Report {
    id: number;
    user_id: number;
    title: string;
    content: string;
    type: 'inventory' | 'incident' | 'general' | 'request';
    status: 'pending' | 'seen' | 'resolved';
    admin_reply?: string | null;
    seen_at?: string | null;
    created_at: string;
    updated_at: string;
    user?: { id: number; name: string; email: string };
}

export const reportApi = {
    getAll: (params?: { per_page?: number }) =>
        axiosClient.get<any>('/reports', { params }),

    create: (data: { title: string; content: string; type: string }) =>
        axiosClient.post<Report>('/reports', data),

    markSeen: (id: number) =>
        axiosClient.put<Report>(`/reports/${id}/seen`),

    reply: (id: number, admin_reply: string) =>
        axiosClient.put<Report>(`/reports/${id}/reply`, { admin_reply }),
};
