import { useEffect, useState, useCallback } from 'react';
import {
    Modal, Form, Select, InputNumber, Button,
    Table, Typography, Space, Divider, Alert,
    Card, Tag, Tooltip,
} from 'antd';
import {
    PlusOutlined, DeleteOutlined, RobotOutlined, BulbOutlined, ArrowDownOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axiosClient from '../../api/axiosClient';
import { productApi } from '../../api/product/productApi';
import type { StoreImportRequest, StoreImportDetailRequest, AISuggestion } from '../../types/Admin/import';

const { Text, Title } = Typography;

interface ProductOption {
    id: number;
    name: string;
    unit: string;
    import_price: number;
    sell_price: number;
    stock: number;
    supplier?: { name: string };
}

interface FormLine extends StoreImportDetailRequest {
    _key: number;
    _productName?: string;
    _unit?: string;
}

interface Props {
    open: boolean;
    loading: boolean;
    editingImport?: import('../../types/Admin/import').Import | null;
    onSubmit: (data: StoreImportRequest) => Promise<any> | void;
    onClose: () => void;
}

let _keyCounter = 0;

const formatVnd = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

export default function ImportFormModal({ open, loading, editingImport, onSubmit, onClose }: Props) {
    const [form] = Form.useForm();
    const [lines, setLines] = useState<FormLine[]>([]);
    const [products, setProducts] = useState<ProductOption[]>([]);
    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [discount, setDiscount] = useState(0);

    // Load products + prefill when modal opens
    useEffect(() => {
        if (open) {
            productApi.getAll({ per_page: 999 }).then((res: any) => {
                const raw = res.data;
                const list = Array.isArray(raw) ? raw : (raw?.data || []);
                setProducts(list);

                // Prefill lines when editing
                if (editingImport?.details?.length) {
                    setLines(editingImport.details.map(d => ({
                        _key: ++_keyCounter,
                        product_id: d.product_id,
                        quantity: d.quantity,
                        unit_price: d.unit_price,
                        _productName: d.product?.name ?? '',
                        _unit: d.product?.unit ?? '',
                    })));
                    setDiscount(editingImport.discount_amount ?? 0);
                    form.setFieldsValue({ note: editingImport.note ?? '' });
                }
            });
            fetchAiSuggestions();
        } else {
            resetForm();
        }
    }, [open, editingImport]);

    const fetchAiSuggestions = async () => {
        setAiLoading(true);
        try {
            const res = await axiosClient.get('/dashboard/alerts');
            setSuggestions(res.data?.suggestions ?? []);
        } catch {
            setSuggestions([]);
        } finally {
            setAiLoading(false);
        }
    };

    const resetForm = () => {
        form.resetFields();
        setLines([]);
        setDiscount(0);
        setSuggestions([]);
    };

    const addEmptyLine = () => {
        setLines(prev => [...prev, {
            _key: ++_keyCounter,
            product_id: 0,
            quantity: 1,
            unit_price: 0,
            _productName: '',
            _unit: '',
        }]);
    };

    const addFromSuggestion = (s: AISuggestion) => {
        const prod = products.find(p => p.id === s.product_id);
        if (!prod) return;
        setLines(prev => [...prev, {
            _key: ++_keyCounter,
            product_id: s.product_id,
            quantity: s.suggested_qty,
            unit_price: prod.import_price,
            _productName: prod.name,
            _unit: prod.unit,
        }]);
    };

    const removeLine = (key: number) => {
        setLines(prev => prev.filter(l => l._key !== key));
    };

    const updateLine = (key: number, field: keyof FormLine, value: any) => {
        setLines(prev => prev.map(l => {
            if (l._key !== key) return l;
            if (field === 'product_id') {
                const prod = products.find(p => p.id === value);
                return {
                    ...l,
                    product_id: value,
                    unit_price: prod?.import_price ?? 0,
                    _productName: prod?.name ?? '',
                    _unit: prod?.unit ?? '',
                };
            }
            return { ...l, [field]: value };
        }));
    };

    const totalPrice = lines.reduce((sum, l) => sum + l.quantity * l.unit_price, 0);
    const grandTotal = Math.max(0, totalPrice - discount);

    const handleOk = () => {
        const validLines = lines.filter(l => l.product_id > 0 && l.quantity > 0);
        if (validLines.length === 0) {
            Modal.warning({ title: 'Chưa có sản phẩm', content: 'Vui lòng thêm ít nhất 1 sản phẩm vào phiếu nhập.' });
            return;
        }
        form.validateFields().then(values => {
            onSubmit({
                note: values.note,
                discount_amount: discount,
                details: validLines.map(l => ({
                    product_id: l.product_id,
                    quantity: l.quantity,
                    unit_price: l.unit_price,
                })),
            });
        });
    };

    const lineColumns: ColumnsType<FormLine> = [
        {
            title: 'Sản phẩm',
            key: 'product_id',
            width: 280,
            render: (_: any, row: FormLine) => (
                <Select
                    showSearch
                    value={row.product_id || undefined}
                    placeholder="Chọn sản phẩm"
                    style={{ width: '100%' }}
                    optionFilterProp="label"
                    options={products.map(p => ({
                        value: p.id,
                        label: `${p.name} (Tồn: ${p.stock} ${p.unit})`,
                    }))}
                    onChange={val => updateLine(row._key, 'product_id', val)}
                />
            ),
        },
        {
            title: 'ĐVT',
            key: 'unit',
            width: 70,
            render: (_: any, row: FormLine) => (
                <Text type="secondary">{row._unit || '—'}</Text>
            ),
        },
        {
            title: 'Số lượng',
            key: 'quantity',
            width: 110,
            render: (_: any, row: FormLine) => (
                <InputNumber
                    min={1}
                    value={row.quantity}
                    style={{ width: '100%' }}
                    onChange={val => updateLine(row._key, 'quantity', val ?? 1)}
                />
            ),
        },
        {
            title: 'Đơn giá nhập',
            key: 'unit_price',
            width: 170,
            render: (_: any, row: FormLine) => (
                <InputNumber
                    min={0}
                    value={row.unit_price}
                    style={{ width: '100%' }}
                    formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={v => (v ? Number(v.replace(/,/g, '')) : 0) as any}
                    addonAfter="₫"
                    onChange={val => updateLine(row._key, 'unit_price', val ?? 0)}
                />
            ),
        },
        {
            title: 'Thành tiền',
            key: 'total',
            width: 140,
            align: 'right',
            render: (_: any, row: FormLine) => (
                <Text strong style={{ color: '#6366f1' }}>
                    {formatVnd(row.quantity * row.unit_price)}
                </Text>
            ),
        },
        {
            title: '',
            key: 'del',
            width: 50,
            render: (_: any, row: FormLine) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeLine(row._key)}
                />
            ),
        },
    ];

    return (
        <Modal
            title={editingImport ? `Chỉnh sửa phiếu nhập — ${editingImport.code}` : 'Lập phiếu nhập kho mới'}
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            confirmLoading={loading}
            width={1000}
            okText={editingImport ? 'Lưu thay đổi' : 'Tạo phiếu nhập'}
            cancelText="Hủy"
            destroyOnClose
            styles={{ body: { maxHeight: '80vh', overflowY: 'auto', paddingTop: 12 } }}
        >
            {/* ── AI Suggestions Panel ── */}
            <Card
                size="small"
                title={
                    <Space>
                        <RobotOutlined style={{ color: '#6366f1' }} />
                        <Text strong style={{ color: '#6366f1' }}>Gợi ý nhập hàng từ AI</Text>
                        <Tag color="purple">
                            {aiLoading ? 'Đang phân tích...' : `${suggestions.length} gợi ý`}
                        </Tag>
                    </Space>
                }
                style={{ marginBottom: 16, background: '#f5f3ff', borderColor: '#a78bfa' }}
                loading={aiLoading}
                extra={
                    <Button size="small" icon={<RobotOutlined />} onClick={fetchAiSuggestions}>
                        Làm mới
                    </Button>
                }
            >
                {suggestions.length === 0 && !aiLoading ? (
                    <Text type="secondary">Tồn kho đang ở mức an toàn, không có gợi ý nhập hàng.</Text>
                ) : (
                    <div style={{
                        display: 'flex',
                        gap: 8,
                        overflowX: 'auto',
                        paddingBottom: 4,
                    }}>
                        {suggestions.map(s => (
                            <Card
                                key={s.product_id}
                                size="small"
                                style={{
                                    minWidth: 200,
                                    maxWidth: 210,
                                    flex: '0 0 auto',
                                    cursor: 'pointer',
                                    borderColor: '#c4b5fd',
                                    background: '#faf5ff',
                                    transition: 'all 0.2s',
                                }}
                                hoverable
                                onClick={() => addFromSuggestion(s)}
                            >
                                <Space direction="vertical" size={2}>
                                    <Tooltip title={s.product_name}>
                                        <Text strong ellipsis style={{ maxWidth: 180, display: 'block' }}>
                                            <BulbOutlined style={{ color: '#eab308', marginRight: 4 }} />
                                            {s.product_name}
                                        </Text>
                                    </Tooltip>
                                    <Text type="secondary" style={{ fontSize: 11 }}>
                                        Tồn: {s.current_stock} / Ngưỡng: {s.reorder_level} {s.unit}
                                    </Text>
                                    <Tag color="purple">
                                        <ArrowDownOutlined /> Gợi ý nhập: {s.suggested_qty} {s.unit}
                                    </Tag>
                                    <Text style={{ fontSize: 11, color: '#6366f1' }}>
                                        Click để thêm vào phiếu →
                                    </Text>
                                </Space>
                            </Card>
                        ))}
                    </div>
                )}
            </Card>

            {/* ── Product Lines Table ── */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>
                    Danh sách sản phẩm nhập
                </Title>
                <Button icon={<PlusOutlined />} onClick={addEmptyLine} type="dashed">
                    Thêm dòng
                </Button>
            </div>

            <Table
                columns={lineColumns}
                dataSource={lines}
                rowKey="_key"
                pagination={false}
                size="small"
                scroll={{ x: 800 }}
                locale={{ emptyText: 'Thêm sản phẩm từ gợi ý AI hoặc nhấn "Thêm dòng"' }}
                summary={() => (
                    <Table.Summary>
                        <Table.Summary.Row>
                            <Table.Summary.Cell index={0} colSpan={4} align="right">
                                <Text type="secondary">Tổng tiền hàng:</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={1} align="right">
                                <Text strong>{formatVnd(totalPrice)}</Text>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={2} />
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />

            <Divider style={{ margin: '12px 0' }} />

            {/* ── Footer: Note + Discount + Total ── */}
            <Form form={form} layout="vertical">
                <div style={{ display: 'flex', gap: 16 }}>
                    <Form.Item name="note" label="Ghi chú phiếu nhập" style={{ flex: 1 }}>
                        <textarea
                            rows={2}
                            placeholder="Nhập ghi chú..."
                            style={{
                                width: '100%',
                                padding: '4px 11px',
                                border: '1px solid #d9d9d9',
                                borderRadius: 6,
                                fontFamily: 'inherit',
                                fontSize: 14,
                                resize: 'vertical',
                            }}
                        />
                    </Form.Item>
                    <div style={{ minWidth: 270 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text>Chiết khấu (VND):</Text>
                            <InputNumber
                                min={0}
                                max={totalPrice}
                                value={discount}
                                style={{ width: 160 }}
                                formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={v => (v ? Number(v.replace(/,/g, '')) : 0) as any}
                                onChange={val => setDiscount(val ?? 0)}
                            />
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: 15 }}>Tổng thanh toán:</Text>
                            <Text strong style={{ fontSize: 18, color: '#6366f1' }}>
                                {formatVnd(grandTotal)}
                            </Text>
                        </div>
                    </div>
                </div>
            </Form>

            {lines.length === 0 && (
                <Alert
                    message="Phiếu nhập trống"
                    description="Hãy thêm ít nhất 1 sản phẩm vào phiếu nhập trước khi tạo."
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                />
            )}
        </Modal>
    );
}
