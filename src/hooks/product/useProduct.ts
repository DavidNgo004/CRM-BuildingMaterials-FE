import { useState } from "react";
import { productApi } from "../../api/product/productApi";
import type { Product, CreateProductRequest, UpdateProductRequest } from "../../types/product";
import { message } from "antd";

export const useProduct = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async (params?: any) => {
        setLoading(true);
        setError(null);
        try {
            const defaultParams = { per_page: 100000, ...params };
            const res = await productApi.getAll(defaultParams);
            // Backend returns pagination object { current_page, data, ... }
            setProducts(res.data.data);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    const createProduct = async (data: CreateProductRequest): Promise<boolean> => {
        try {
            await productApi.create(data);
            message.success('Thêm sản phẩm thành công');
            fetchProducts();
            return true;
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi thêm sản phẩm');
            return false;
        }
    };

    const updateProduct = async (id: number, data: UpdateProductRequest): Promise<boolean> => {
        try {
            await productApi.update(id, data);
            message.success('Cập nhật sản phẩm thành công');
            fetchProducts();
            return true;
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
            return false;
        }
    };

    const deleteProduct = async (id: number): Promise<boolean> => {
        try {
            await productApi.delete(id);
            message.success('Xóa sản phẩm thành công');
            fetchProducts();
            return true;
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm');
            return false;
        }
    };

    const exportExcelProducts = async () => {
        try {
            const res = await productApi.exportExcel();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success('Xuất file Excel thành công');
        } catch (err: any) {
            console.error(err);
            message.error('Có lỗi xảy ra khi xuất file Excel');
        }
    };

    const downloadExcelTemplateProducts = async () => {
        try {
            const res = await productApi.downloadTemplateExcel();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'mau_nhap_san_pham.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            message.success('Tải file mẫu thành công');
        } catch (err: any) {
            console.error(err);
            message.error('Có lỗi xảy ra khi tải file mẫu');
        }
    };

    const importExcelProducts = async (file: File): Promise<boolean> => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            await productApi.importExcel(formData);
            message.success('Nhập file Excel thành công');
            fetchProducts();
            return true;
        } catch (err: any) {
            console.error(err);
            message.error(err.response?.data?.message || 'Có lỗi xảy ra khi nhập file Excel');
            return false;
        }
    };

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        exportExcelProducts,
        importExcelProducts,
        downloadExcelTemplateProducts
    };
};
