export type ExportStatus = 'pending' | 'approved' | 'completed' | 'cancelled';

export interface ExportDetail {
  id: number;
  export_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  import_price: number;
  total_price: number;
  product?: {
    id: number;
    name: string;
    unit: string;
    sell_price: number;
    import_price: number;
    stock: number;
  };
}

export interface Export {
  id: number;
  code: string;
  user_id: number;
  customer_id: number;
  total_price: number;
  discount_amount: number;
  grand_total: number;
  status: ExportStatus;
  note?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  customer?: {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  details?: ExportDetail[];
}

export interface ChangeExportStatusRequest {
  status: ExportStatus;
}

export interface ExportDetailRequest {
  product_id: number;
  quantity: number;
}

export interface StoreExportRequest {
  customer_id: number;
  discount_amount: number;
  note?: string;
  details: ExportDetailRequest[];
}
