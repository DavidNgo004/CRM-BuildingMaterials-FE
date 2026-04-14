import { useState, useCallback } from 'react';
import { message } from 'antd';
import { exportApi } from '../../api/export/exportApi';
import type { Export, ExportStatus } from '../../types/Admin/export';

export const useExport = () => {
    const [exports, setExports] = useState<Export[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchExports = useCallback(async (params?: { search?: string; per_page?: number }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await exportApi.getAll(params);
            const rawData = res.data;
            const list = Array.isArray(rawData) ? rawData : (rawData?.data || []);
            setExports(list);
            setTotal(rawData?.total ?? list.length);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải danh sách phiếu xuất');
        } finally {
            setLoading(false);
        }
    }, []);

    const changeStatus = async (id: number, status: ExportStatus): Promise<boolean> => {
        try {
            await exportApi.changeStatus(id, { status });
            const statusLabel: Record<ExportStatus, string> = {
                pending: 'Chờ xử lý',
                approved: 'Đã duyệt',
                completed: 'Hoàn thành',
                cancelled: 'Đã hủy',
            };
            message.success(`Cập nhật trạng thái → ${statusLabel[status]}`);
            await fetchExports({ per_page: 9999 });
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
            return false;
        }
    };

    const deleteExport = async (id: number): Promise<boolean> => {
        try {
            await exportApi.delete(id);
            message.success('Xóa phiếu xuất thành công');
            await fetchExports({ per_page: 9999 });
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể xóa phiếu xuất');
            return false;
        }
    };

    return {
        exports,
        loading,
        error,
        total,
        fetchExports,
        changeStatus,
        deleteExport,
    };
};
