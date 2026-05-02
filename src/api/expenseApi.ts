import axiosClient from "./axiosClient";
import type { Expense, ExpenseFormData, ExpenseResponse } from "../types/Admin/expense";

export const expenseApi = {
  getExpenses: (params?: { page?: number; per_page?: number; search?: string }) => {
    return axiosClient.get<ExpenseResponse>("/expenses", { params });
  },

  getExpenseById: (id: number) => {
    return axiosClient.get<Expense>(`/expenses/${id}`);
  },

  createExpense: (data: ExpenseFormData) => {
    return axiosClient.post<Expense>("/expenses", data);
  },

  updateExpense: (id: number, data: ExpenseFormData) => {
    return axiosClient.put<Expense>(`/expenses/${id}`, data);
  },

  deleteExpense: (id: number) => {
    return axiosClient.delete(`/expenses/${id}`);
  },
};
