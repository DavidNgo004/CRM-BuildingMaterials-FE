import { useState, useCallback } from 'react';
import { message } from 'antd';
import { importApi } from '../../api/import/importApi';
import type { Import } from '../../types/Admin/import';

export const useStaffImportList = () => {
    const [imports, setImports] = useState<Import[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchImports = useCallback(async () => {
        setLoading(true);
        try {
            const res = await importApi.getAll({ per_page: 9999 });
            const data = res.data?.data || res.data || [];
            setImports(Array.isArray(data) ? data : []);
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể tải danh sách đơn nhập');
        } finally {
            setLoading(false);
        }
    }, []);

    const confirmDelivered = useCallback(async (id: number) => {
        try {
            await importApi.changeStatus(id, { status: 'completed' });
            message.success('Xác nhận hàng về kho thành công! Tồn kho đã được cập nhật.');
            await fetchImports();
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể xác nhận');
        }
    }, [fetchImports]);

    const cancelImport = useCallback(async (id: number) => {
        try {
            await importApi.changeStatus(id, { status: 'cancelled' });
            message.success('Đã hủy đơn nhập hàng');
            await fetchImports();
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể hủy đơn');
        }
    }, [fetchImports]);

    return { imports, loading, fetchImports, confirmDelivered, cancelImport };
};
