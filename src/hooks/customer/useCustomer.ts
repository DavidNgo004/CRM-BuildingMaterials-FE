import { useState, useCallback } from 'react';
import { customerApi } from '../../api/customer/customerApi';
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../../types/Admin/customer';
import { message } from 'antd';

export const useCustomer = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async (search?: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await customerApi.getAll({ search });
            // Backend trả về object phân trang, data nằm trong res.data.data
            // Hoặc nếu backend trả về array trực tiếp
            const rawData = res.data;
            const actualList = Array.isArray(rawData) ? rawData : (rawData?.data || []);
            setCustomers(actualList);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải danh sách khách hàng');
        } finally {
            setLoading(false);
        }
    }, []);

    const createCustomer = async (data: CreateCustomerRequest) => {
        try {
            await customerApi.create(data);
            message.success('Thêm khách hàng thành công');
            await fetchCustomers();
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể thêm khách hàng');
            return false;
        }
    };

    const updateCustomer = async (id: number, data: UpdateCustomerRequest) => {
        try {
            await customerApi.update(id, data);
            message.success('Cập nhật khách hàng thành công');
            await fetchCustomers();
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể cập nhật khách hàng');
            return false;
        }
    };

    const deleteCustomer = async (id: number) => {
        try {
            await customerApi.delete(id);
            message.success('Xóa khách hàng thành công');
            await fetchCustomers();
            return true;
        } catch (err: any) {
            message.error(err.response?.data?.message || 'Không thể xóa khách hàng');
            return false;
        }
    };

    return {
        customers,
        loading,
        error,
        fetchCustomers,
        createCustomer,
        updateCustomer,
        deleteCustomer,
    };
};
