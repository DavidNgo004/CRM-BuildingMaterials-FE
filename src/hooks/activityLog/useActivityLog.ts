import { useState, useCallback } from 'react';
import { activityLogApi, type ActivityLog, type ActivityLogFilters, type ActivityLogPagination } from '../../api/activityLog/activityLogApi';
import { message } from 'antd';

interface UseActivityLogReturn {
    logs: ActivityLog[];
    pagination: ActivityLogPagination | null;
    loading: boolean;
    fetchLogs: (filters?: ActivityLogFilters) => Promise<void>;
}

export function useActivityLog(): UseActivityLogReturn {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [pagination, setPagination] = useState<ActivityLogPagination | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchLogs = useCallback(async (filters: ActivityLogFilters = {}) => {
        setLoading(true);
        try {
            const res = await activityLogApi.getAll(filters);
            setLogs(res.data.data);
            setPagination(res.data);
        } catch {
            message.error('Không thể tải lịch sử hoạt động.');
        } finally {
            setLoading(false);
        }
    }, []);

    return { logs, pagination, loading, fetchLogs };
}
