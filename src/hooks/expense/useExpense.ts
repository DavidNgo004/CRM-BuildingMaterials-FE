import { useState, useCallback } from 'react';
import { message } from 'antd';
import { expenseApi } from '../../api/expenseApi';
import type { Expense, ExpenseFormData } from '../../types/Admin/expense';

export const useExpense = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchExpenses = useCallback(async (page = 1, perPage = 15, search = '') => {
    setLoading(true);
    try {
      const response = await expenseApi.getExpenses({ page, per_page: perPage, search });
      if (response.data) {
        setExpenses(response.data.data);
        setTotal(response.data.total);
      }
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
      message.error(error.response?.data?.message || 'Lỗi khi tải danh sách chi phí');
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = async (data: ExpenseFormData) => {
    try {
      await expenseApi.createExpense(data);
      message.success('Thêm khoản chi thành công');
      return true;
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi thêm khoản chi');
      return false;
    }
  };

  const updateExpense = async (id: number, data: ExpenseFormData) => {
    try {
      await expenseApi.updateExpense(id, data);
      message.success('Cập nhật khoản chi thành công');
      return true;
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật khoản chi');
      return false;
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await expenseApi.deleteExpense(id);
      message.success('Xóa khoản chi thành công');
      return true;
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi xóa khoản chi');
      return false;
    }
  };

  return {
    expenses,
    loading,
    total,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
};
