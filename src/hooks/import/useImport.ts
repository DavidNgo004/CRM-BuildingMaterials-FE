import { useState, useCallback } from 'react';
import { message } from 'antd';
import { importApi } from '../../api/import/importApi';
import type {
    Import,
    ImportStatus,
    StoreImportRequest,
    UpdateImportRequest,
} from '../../types/Admin/import';

export const useImport = () => {
    const [imports, setImports] = useState<Import[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState(0);

    const fetchImports = useCallback(async (params?: { search?: string; per_page?: number }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await importApi.getAll(params);
            const rawData = res.data;
            const list = Array.isArray(rawData) ? rawData : (rawData?.data || []);
            setImports(list);
            setTotal(rawData?.total ?? list.length);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải danh sách phiếu nhập');
        } finally {
            setLoading(false);
        }
    }, []);

    const createImport = async (data: StoreImportRequest): Promise<Import | null> => {
        try {
            const res = await importApi.create(data);
            message.success('Tạo phiếu nhập thành công');
            await fetchImports();
            return res.data;
        } catch (err: any) {
            const errMsg = err.response?.data?.message || 'Không thể tạo phiếu nhập';
            message.error(errMsg);
            return null;
        }
    };

    const updateImport = async (id: number, data: UpdateImportRequest): Promise<boolean> => {
        try {
            await importApi.update(id, data);
            message.success('Cập nhật phiếu nhập thành công');
            await fetchImports();
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể cập nhật phiếu nhập');
            return false;
        }
    };

    const changeStatus = async (id: number, status: ImportStatus): Promise<boolean> => {
        try {
            await importApi.changeStatus(id, { status });
            const statusLabel: Record<ImportStatus, string> = {
                pending: 'Chờ duyệt',
                approved: 'Đã duyệt',
                completed: 'Hoàn thành',
                cancelled: 'Đã hủy',
            };
            message.success(`Cập nhật trạng thái → ${statusLabel[status]}`);
            await fetchImports();
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể cập nhật trạng thái');
            return false;
        }
    };

    const deleteImport = async (id: number): Promise<boolean> => {
        try {
            await importApi.delete(id);
            message.success('Xóa phiếu nhập thành công');
            await fetchImports();
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể xóa phiếu nhập');
            return false;
        }
    };

    return {
        imports,
        loading,
        error,
        total,
        fetchImports,
        createImport,
        updateImport,
        changeStatus,
        deleteImport,
    };
};
