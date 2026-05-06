import axiosClient from '../axiosClient';

export interface ActivityLog {
    id: number;
    user_id: number | null;
    user_name: string | null;
    user_role: 'admin' | 'warehouse_staff' | null;
    action: string;
    entity_type: string;
    entity_id: number | null;
    old_data: Record<string, unknown> | null;
    new_data: Record<string, unknown> | null;
    description: string | null;
    ip_address: string | null;
    created_at: string;
    user?: {
        id: number;
        name: string;
        role: string;
    } | null;
}

export interface ActivityLogPagination {
    data: ActivityLog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface ActivityLogFilters {
    action?: string;
    entity_type?: string;
    user_id?: number;
    from?: string;
    to?: string;
    search?: string;
    per_page?: number;
    page?: number;
}

export const activityLogApi = {
    getAll: (filters: ActivityLogFilters = {}): Promise<{ data: ActivityLogPagination }> => {
        return axiosClient.get('/activity-logs', { params: filters });
    },
};
