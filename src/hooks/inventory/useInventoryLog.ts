import { useState, useCallback } from 'react';
import { message } from 'antd';
import type { InventoryLog } from '../../api/inventory/inventoryLogApi';
import { inventoryLogApi } from '../../api/inventory/inventoryLogApi';

export const useInventoryLog = () => {
    const [logs, setLogs] = useState<InventoryLog[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async (params?: { product_id?: number; type?: 'import' | 'export'; per_page?: number; from_date?: string; to_date?: string }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await inventoryLogApi.getAll({ per_page: 50, ...params });
            setLogs(res.data?.data || res.data || []);
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || 'Không thể tải lịch sử tồn kho';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        logs,
        loading,
        error,
        fetchLogs
    };
};
