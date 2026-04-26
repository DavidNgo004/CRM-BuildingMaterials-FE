import { useState, useCallback } from 'react';
import { message } from 'antd';
import { exportApi } from '../../api/export/exportApi';
import { customerApi } from '../../api/customer/customerApi';
import { productApi } from '../../api/product/productApi';
import type { Product } from '../../types/product';
import type { Customer } from '../../types/Admin/customer';
import type { StoreExportRequest, ExportDetailRequest } from '../../types/Admin/export';

export interface StaffExportLine {
    id: number;
    product_id: string | number;
    quantity: number;
    unit_price: number;
}

export const useStaffExportForm = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const [customerId, setCustomerId] = useState<number | "">("");
    const [exportDate, setExportDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // New customer fields
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState('');
    const [newCustomerPhone, setNewCustomerPhone] = useState('');
    const [newCustomerAddress, setNewCustomerAddress] = useState('');
    const [newCustomerEmail, setNewCustomerEmail] = useState('');
    const [newCustomerType, setNewCustomerType] = useState('');

    const [lines, setLines] = useState<StaffExportLine[]>([
        { id: Date.now(), product_id: "", quantity: 1, unit_price: 0 }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch initial data
    const fetchData = useCallback(async () => {
        try {
            const [custRes, prodRes] = await Promise.all([
                customerApi.getAll({ per_page: 999 }),
                productApi.getAll({ per_page: 999 })
            ]);
            const cData = custRes.data?.data || custRes.data || [];
            const pData = prodRes.data?.data || prodRes.data || [];

            setCustomers(Array.isArray(cData) ? cData as Customer[] : []);
            setProducts(Array.isArray(pData) ? pData as Product[] : []);
        } catch (error) {
            console.error(error);
        }
    }, []);

    const addLine = () => {
        setLines([...lines, { id: Date.now(), product_id: "", quantity: 1, unit_price: 0 }]);
    };

    const removeLine = (id: number) => {
        setLines(lines.filter(l => l.id !== id));
    };

    const updateLine = (id: number, field: keyof StaffExportLine, value: string | number) => {
        setLines(lines.map(l => {
            if (l.id === id) {
                const newLine = { ...l, [field]: value };
                if (field === 'product_id') {
                    const prod = products.find(p => p.id === Number(value));
                    if (prod) {
                        newLine.unit_price = prod.sell_price || 0;
                    }
                }
                return newLine;
            }
            return l;
        }));
    };

    const grandTotal = lines.reduce((sum, l) => sum + (Number(l.quantity) * Number(l.unit_price) || 0), 0);

    const handleSubmit = async () => {
        const validLines = lines.filter(l => l.product_id && l.quantity > 0);
        if (validLines.length === 0) {
            message.warning("Vui lòng thêm ít nhất 1 sản phẩm hợp lệ.");
            return;
        }

        if (!isNewCustomer && !customerId) {
            message.warning("Vui lòng chọn khách hàng.");
            return;
        }
        if (isNewCustomer && !newCustomerName.trim()) {
            message.warning("Vui lòng nhập tên khách hàng mới.");
            return;
        }

        setIsSubmitting(true);
        try {
            let finalCustomerId: number | undefined = undefined;

            if (isNewCustomer) {
                // Tạo mới khách hàng trước, rồi lấy ID
                const newCust = await customerApi.create({
                    name: newCustomerName.trim(),
                    phone: newCustomerPhone.trim() || undefined,
                } as any);
                finalCustomerId = newCust.data.id;
            } else {
                finalCustomerId = Number(customerId);
            }

            const exportData: StoreExportRequest = {
                customer_id: finalCustomerId!,
                note: `Ngày xuất: ${exportDate}`,
                discount_amount: 0,
                details: validLines.map(l => ({
                    product_id: Number(l.product_id),
                    quantity: Number(l.quantity)
                })) as ExportDetailRequest[]
            };

            await exportApi.create(exportData);

            message.success("Tạo phiếu xuất thành công!");
            setLines([{ id: Date.now(), product_id: "", quantity: 1, unit_price: 0 }]);
            setCustomerId("");
            setNewCustomerName('');
            setNewCustomerPhone('');
            setNewCustomerAddress('');
            setNewCustomerEmail('');
            setNewCustomerType('');
            setIsNewCustomer(false);

            // Refresh customer list if new customer was created
            if (isNewCustomer) await fetchData();
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || "Lỗi khi tạo phiếu xuất");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // State
        customers, products,
        customerId, setCustomerId,
        exportDate, setExportDate,
        lines, isSubmitting, grandTotal,
        isNewCustomer, setIsNewCustomer,
        newCustomerName, setNewCustomerName,
        newCustomerPhone, setNewCustomerPhone,
        newCustomerAddress, setNewCustomerAddress,
        newCustomerType, setNewCustomerType,
        newCustomerEmail, setNewCustomerEmail,

        // Actions
        fetchData, addLine, removeLine, updateLine, handleSubmit
    };
};
