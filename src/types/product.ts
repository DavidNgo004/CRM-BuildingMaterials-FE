import type { Supplier } from "./Admin/supplier";

export interface Product {
    id: number;
    supplier_id: number;
    name: string;
    unit: string;
    import_price: number;
    sell_price: number;
    stock: number;
    reorder_level: number | null;
    status: boolean | number;
    created_at?: string;
    updated_at?: string;
    supplier?: Supplier;
    updated_by_user?: { id: number; name: string };
    updated_by?: number;
}

export interface CreateProductRequest {
    supplier_id: number;
    name: string;
    unit: string;
    import_price: number;
    sell_price: number;
    status?: boolean | number;
    reorder_level?: number;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
