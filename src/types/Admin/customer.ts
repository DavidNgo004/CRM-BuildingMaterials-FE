export interface Customer {
  id: number;
  code: string;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  customer_type: 'retail' | 'wholesale';
  status: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  customer_type?: 'retail' | 'wholesale';
  status?: boolean;
  notes?: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}
