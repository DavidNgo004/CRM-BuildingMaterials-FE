import { useEffect, useState } from "react";
import { supplierApi } from "../../api/supplier/supplierApi";
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from "../../types/supplier";
import { message } from "antd";

export const useSupplier = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSuppliers = async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const res = await supplierApi.getAll(params);
            setSuppliers(res.data.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Không thể tải danh sách nhà cung cấp");
        } finally {
            setLoading(false);
        }
    };

    const createSupplier = async (data: CreateSupplierRequest): Promise<boolean> => {
        try {
            await supplierApi.create(data);
            message.success('Thêm nhà cung cấp thành công');
            fetchSuppliers();
            return true;
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm nhà cung cấp');
            return false;
        }
    };

    const updateSupplier = async (id: number, data: UpdateSupplierRequest): Promise<boolean> => {
        try {
            await supplierApi.update(id, data);
            message.success('Cập nhật nhà cung cấp thành công');
            fetchSuppliers();
            return true;
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật nhà cung cấp');
            return false;
        }
    };

    const deleteSupplier = async (id: number): Promise<boolean> => {
        try {
            await supplierApi.delete(id);
            message.success('Xóa nhà cung cấp thành công');
            fetchSuppliers();
            return true;
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi xóa nhà cung cấp');
            return false;
        }
    };

    return {
        suppliers,
        loading,
        error,
        fetchSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier
    };
};