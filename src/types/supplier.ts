export interface Supplier {
  id: number;
  code: string;
  name: string;
  tax_code?: string;
  email?: string;
  phone: string;
  address: string;
  status: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSupplierRequest {
  name: string;
  tax_code?: string;
  email?: string;
  phone: string;
  address: string;
  status?: boolean;
  notes?: string;
}

export interface UpdateSupplierRequest {
  name?: string;
  tax_code?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: boolean;
  notes?: string;
}
