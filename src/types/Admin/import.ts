export type ImportStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface ImportDetail {
  id: number;
  import_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product?: {
    id: number;
    name: string;
    unit: string;
    import_price: number;
    sell_price: number;
    stock: number;
    supplier?: {
      id: number;
      name: string;
      email?: string;
    };
  };
}

export interface Import {
  id: number;
  code: string;
  user_id: number;
  total_price: number;
  discount_amount: number;
  grand_total: number;
  status: ImportStatus;
  note?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  details?: ImportDetail[];
}

export interface StoreImportDetailRequest {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface StoreImportRequest {
  note?: string;
  discount_amount?: number;
  details: StoreImportDetailRequest[];
}

export type UpdateImportRequest = StoreImportRequest;

export interface ChangeImportStatusRequest {
  status: ImportStatus;
}

export interface AISuggestion {
  product_id: number;
  product_name: string;
  unit: string;
  current_stock: number;
  reorder_level: number;
  suggested_qty: number;
  message: string;
}
