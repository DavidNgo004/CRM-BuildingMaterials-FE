import axiosClient from "../axiosClient";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "../../types/Admin/customer";

export const customerApi = {
    getAll: (params?: { search?: string; per_page?: number }) => {
        return axiosClient.get<any>("/customers", { params });
    },

    getById: (id: number) => {
        return axiosClient.get<Customer>(`/customers/${id}`);
    },

    create: (data: CreateCustomerRequest) => {
        return axiosClient.post<Customer>("/customers", data);
    },

    update: (id: number, data: UpdateCustomerRequest) => {
        return axiosClient.put<Customer>(`/customers/${id}`, data);
    },

    delete: (id: number) => {
        return axiosClient.delete<{ message: string }>(`/customers/${id}`);
    }
}