import axiosClient from '../axiosClient';
import type {
    Import,
    StoreImportRequest,
    UpdateImportRequest,
    ChangeImportStatusRequest,
} from '../../types/Admin/import';

export const importApi = {
    getAll: (params?: { search?: string; per_page?: number }) =>
        axiosClient.get<any>('/imports', { params }),

    getById: (id: number) =>
        axiosClient.get<Import>(`/imports/${id}`),

    create: (data: StoreImportRequest) =>
        axiosClient.post<Import>('/imports', data),

    update: (id: number, data: UpdateImportRequest) =>
        axiosClient.put<Import>(`/imports/${id}`, data),

    changeStatus: (id: number, data: ChangeImportStatusRequest) =>
        axiosClient.put<Import>(`/imports/${id}/status`, data),

    delete: (id: number) =>
        axiosClient.delete<{ message: string }>(`/imports/${id}`),
};
