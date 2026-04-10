import axiosClient from "../axiosClient";

export const supplierApi = {

    getAll: (params?: any) =>
        axiosClient.get("/suppliers", { params }),

    getById: (id: number) =>
        axiosClient.get(`/suppliers/${id}`),

    create: (data: any) =>
        axiosClient.post("/suppliers", data),

    update: (id: number, data: any) =>
        axiosClient.put(`/suppliers/${id}`, data),

    delete: (id: number) =>
        axiosClient.delete(`/suppliers/${id}`)
};