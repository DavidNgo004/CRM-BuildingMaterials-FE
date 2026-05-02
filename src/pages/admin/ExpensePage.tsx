import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Typography,
  Space,
  Statistic,
  Row,
  Col,
  Input,
  DatePicker,
  Select,
} from 'antd';
import {
  PlusOutlined,
  DollarOutlined,
  CalendarOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../store/authContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ExpenseTable from '../../components/admin/expense/ExpenseTable';
import ExpenseFormModal from '../../components/admin/expense/ExpenseFormModal';
import { useExpense } from '../../hooks/expense/useExpense';
import type { Expense, ExpenseFormData } from '../../types/Admin/expense';
import '../../styles/auth.css';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const COMMON_EXPENSES = [
  'Chi phí lương nhân viên',
  'Chi phí điện nước',
  'Chi phí thuê mặt bằng',
  'Chi phí marketing/quảng cáo',
  'Chi phí văn phòng phẩm',
  'Chi phí vận chuyển',
  'Khác',
];

export default function ExpensePage() {
  useEffect(() => {
    document.title = 'Quản lý chi phí vận hành';
  }, []);

  const { expenses, loading, total, fetchExpenses, createExpense, updateExpense, deleteExpense } =
    useExpense();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExpenses(currentPage, pageSize, searchText);
  }, [fetchExpenses, currentPage, pageSize, searchText]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handleTableChange = (page: number, newPageSize: number) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  const handleAdd = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const success = await deleteExpense(id);
    if (success) {
      fetchExpenses(currentPage, pageSize, searchText);
    }
  };

  const handleSubmit = async (data: ExpenseFormData) => {
    setSubmitting(true);
    let success = false;

    const finalData = {
      ...data,
      title: Array.isArray(data.title) ? (data.title as any)[0] : data.title,
    };

    if (editingExpense) {
      success = await updateExpense(editingExpense.id, finalData);
    } else {
      success = await createExpense(finalData);
    }

    setSubmitting(false);

    if (success) {
      setIsModalOpen(false);
      fetchExpenses(currentPage, pageSize, searchText);
    }
  };

  // ── Client-side filter (by category + date range) ──
  const filteredExpenses = expenses.filter((e) => {
    const matchCategory = !categoryFilter || e.title === categoryFilter;
    const matchDate =
      !dateRange ||
      !dateRange[0] ||
      !dateRange[1] ||
      (dayjs(e.expense_date).startOf('day').valueOf() >= dateRange[0]!.startOf('day').valueOf() &&
        dayjs(e.expense_date).startOf('day').valueOf() <= dateRange[1]!.startOf('day').valueOf());
    return matchCategory && matchDate;
  });

  // Stats
  const totalAmount = filteredExpenses.reduce((sum, item) => sum + Number(item.amount), 0);
  const thisMonthExpenses = expenses.filter((e) =>
    dayjs(e.expense_date).isSame(dayjs(), 'month'),
  );
  const thisMonthAmount = thisMonthExpenses.reduce((sum, item) => sum + Number(item.amount), 0);

  const formatVND = (n: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <DashboardLayout userName={user?.name ?? 'Admin'} onLogout={handleLogout}>
      <div className="auth-inner-page">
        {/* ── Header ── */}
        <div className="auth-page-header">
          <Space direction="vertical" size={2}>
            <Title level={4} style={{ margin: 0 }}>
              <DollarOutlined style={{ color: '#cf1322', marginRight: 10 }} />
              Quản lý chi phí vận hành
            </Title>
            <Text type="secondary">Theo dõi và quản lý các khoản chi phí hoạt động</Text>
          </Space>

          <Space size="middle" wrap>
            <Input.Search
              placeholder="Tìm kiếm chi phí..."
              allowClear
              onSearch={handleSearch}
              onChange={(e) => {
                if (!e.target.value) handleSearch('');
              }}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
              style={{
                background: 'linear-gradient(135deg, #cf1322, #ff4d4f)',
                border: 'none',
                borderRadius: 8,
                fontWeight: 600,
              }}
            >
              Thêm khoản chi
            </Button>
          </Space>
        </div>

        {/* ── Stats ── */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col>
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
              <Statistic
                title="Tổng chi phí (đang lọc)"
                value={totalAmount}
                formatter={(v) => formatVND(Number(v))}
                prefix={<DollarOutlined style={{ color: '#cf1322' }} />}
                valueStyle={{ fontSize: 22, fontWeight: 700, color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col>
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
              <Statistic
                title="Chi phí tháng này"
                value={thisMonthAmount}
                formatter={(v) => formatVND(Number(v))}
                prefix={<CalendarOutlined style={{ color: '#f59e0b' }} />}
                valueStyle={{ fontSize: 22, fontWeight: 700, color: '#f59e0b' }}
              />
            </Card>
          </Col>
          <Col>
            <Card style={{ borderRadius: 12 }} styles={{ body: { padding: '16px 24px' } }}>
              <Statistic
                title="Số khoản chi (tổng)"
                value={total}
                prefix={<FilterOutlined style={{ color: '#6366f1' }} />}
                valueStyle={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}
              />
            </Card>
          </Col>
        </Row>

        {/* ── Table Card ── */}
        <Card style={{ borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          {/* Filter toolbar */}
          <Space wrap style={{ marginBottom: 16 }}>
            <Select
              allowClear
              placeholder="Lọc theo loại chi phí"
              style={{ width: 230 }}
              value={categoryFilter}
              onChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
              options={COMMON_EXPENSES.map((item) => ({ value: item, label: item }))}
            />
            <RangePicker
              format="DD/MM/YYYY"
              placeholder={['Từ ngày', 'Đến ngày']}
              value={dateRange}
              onChange={(dates) => {
                setDateRange(dates as [Dayjs | null, Dayjs | null] | null);
                setCurrentPage(1);
              }}
            />
          </Space>

          <ExpenseTable
            data={filteredExpenses}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              current: currentPage,
              pageSize,
              total: filteredExpenses.length,
              onChange: handleTableChange,
            }}
          />
        </Card>

        <ExpenseFormModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingExpense}
          loading={submitting}
        />
      </div>
    </DashboardLayout>
  );
}
