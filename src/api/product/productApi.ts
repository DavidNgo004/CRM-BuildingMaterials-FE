import axiosClient from "../axiosClient";

export const productApi = {
    getAll: (params: any) => axiosClient.get('/products', { params }),

    getById: (id: number) => axiosClient.get(`/products/${id}`),

    create: (data: any) => axiosClient.post('/products', data),

    update: (id: number, data: any) => axiosClient.put(`/products/${id}`, data),

    delete: (id: number) => axiosClient.delete(`/products/${id}`)
};