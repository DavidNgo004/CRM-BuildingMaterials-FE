import axiosClient from '../axiosClient';

export interface InventoryLog {
    id: number;
    product_id: number;
    type: 'import' | 'export';
    quantity: number;
    reference_id: number;
    created_at: string;
    product: {
        id: number;
        name: string;
        unit: string;
    };
    reference?: any; // The related Import or Export ticket
}

export const inventoryLogApi = {
    getAll: (params?: { product_id?: number; type?: 'import' | 'export'; per_page?: number; from_date?: string; to_date?: string }) =>
        axiosClient.get<any>('/inventory-logs', { params }),
};
