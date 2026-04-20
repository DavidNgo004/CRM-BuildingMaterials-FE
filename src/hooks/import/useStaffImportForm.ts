import { useState, useCallback } from 'react';
import { message } from 'antd';
import { importApi } from '../../api/import/importApi';
import { supplierApi } from '../../api/supplier/supplierApi';
import { productApi } from '../../api/product/productApi';
import type { Product } from '../../types/product';
import type { Supplier } from '../../types/Admin/supplier';
import type { StoreImportRequest, StoreImportDetailRequest } from '../../types/Admin/import';

export interface StaffImportLine {
    id: number;
    product_id: string | number;
    quantity: number;
    unit_price: number;
}

export const useStaffImportForm = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    
    const [supplierId, setSupplierId] = useState<number | "">("");
    const [importDate, setImportDate] = useState<string>(new Date().toISOString().split('T')[0]);
    
    const [lines, setLines] = useState<StaffImportLine[]>([
        { id: Date.now(), product_id: "", quantity: 1, unit_price: 0 }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Fetch initial data
    const fetchData = useCallback(async () => {
        try {
            const [supRes, prodRes] = await Promise.all([
                supplierApi.getAll({ per_page: 999 }),
                productApi.getAll({ per_page: 999 })
            ]);
            const sData = supRes.data?.data || supRes.data || [];
            const pData = prodRes.data?.data || prodRes.data || [];
            
            setSuppliers(Array.isArray(sData) ? sData as Supplier[] : []);
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

    const updateLine = (id: number, field: keyof StaffImportLine, value: string | number) => {
        setLines(lines.map(l => {
            if (l.id === id) {
                const newLine = { ...l, [field]: value };
                if (field === 'product_id') {
                    const prod = products.find(p => p.id === Number(value));
                    if (prod) {
                        newLine.unit_price = prod.import_price || 0;
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

        setIsSubmitting(true);
        try {
            const supplierName = suppliers.find(s => s.id === Number(supplierId))?.name || 'Chưa chọn';
            
            const importData: StoreImportRequest = {
                note: `Nhà CC: ${supplierName} - Ngày nhập: ${importDate}`,
                details: validLines.map(l => ({
                    product_id: Number(l.product_id),
                    quantity: Number(l.quantity),
                    unit_price: Number(l.unit_price)
                })) as StoreImportDetailRequest[]
            };

            await importApi.create(importData);
            
            message.success("Tạo phiếu nhập thành công!");
            setLines([{ id: Date.now(), product_id: "", quantity: 1, unit_price: 0 }]);
            setSupplierId("");
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            message.error(err.response?.data?.message || "Lỗi khi tạo phiếu nhập");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        // State
        suppliers,
        products,
        supplierId,
        setSupplierId,
        importDate,
        setImportDate,
        lines,
        isSubmitting,
        grandTotal,
        // Actions
        fetchData,
        addLine,
        removeLine,
        updateLine,
        handleSubmit
    };
};
