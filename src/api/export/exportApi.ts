import axiosClient from '../axiosClient';
import type { Export, ChangeExportStatusRequest } from '../../types/Admin/export';

export const exportApi = {
    getAll: (params?: { search?: string; per_page?: number; limit?: number }) =>
        axiosClient.get<any>('/exports', { params: { limit: params?.per_page ?? params?.limit, search: params?.search } }),

    getById: (id: number) =>
        axiosClient.get<Export>(`/exports/${id}`),

    changeStatus: (id: number, data: ChangeExportStatusRequest) =>
        axiosClient.put<Export>(`/exports/${id}/status`, data),

    delete: (id: number) =>
        axiosClient.delete<{ message: string }>(`/exports/${id}`),
};
