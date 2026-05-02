import { useState, useCallback } from 'react';
import { message } from 'antd';
import { exportApi } from '../../api/export/exportApi';
import type { Export } from '../../types/Admin/export';

export const useStaffExportList = () => {
    const [exports, setExports] = useState<Export[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchExports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await exportApi.getAll({ per_page: 9999 });
            const data = res.data?.data || res.data || [];
            setExports(Array.isArray(data) ? data : []);
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể tải danh sách đơn xuất');
        } finally {
            setLoading(false);
        }
    }, []);

    const confirmExported = useCallback(async (id: number) => {
        try {
            await exportApi.changeStatus(id, { status: 'completed' });
            message.success('Xác nhận xuất kho thành công! Tồn kho đã được cập nhật.');
            await fetchExports();
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể xác nhận xuất kho');
        }
    }, [fetchExports]);

    const cancelExport = useCallback(async (id: number) => {
        try {
            await exportApi.changeStatus(id, { status: 'cancelled' });
            message.success('Đã hủy đơn xuất kho');
            await fetchExports();
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể hủy đơn');
        }
    }, [fetchExports]);

    return { exports, loading, fetchExports, confirmExported, cancelExport };
};
