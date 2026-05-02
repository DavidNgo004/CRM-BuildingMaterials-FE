export interface Expense {
  id: number;
  title: string;
  amount: number;
  expense_date: string;
  note: string | null;
  user_id: number;
  user?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  expense_date: string;
  note?: string;
}

export interface ExpenseResponse {
  current_page: number;
  data: Expense[];
  total: number;
  per_page: number;
}
