import { useEffect, useState } from "react";
import styles from "./StaffImportForm.module.css";
import { useStaffImportForm } from "../../../hooks/import/useStaffImportForm";
import axiosClient from "../../../api/axiosClient";
import { Card, Space, Tag, Typography, Button, Tooltip, Select, Input } from "antd";
import { RobotOutlined, BulbOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface AISuggestion {
    product_id: number;
    product_name: string;
    unit: string;
    current_stock: number;
    reorder_level: number;
    suggested_qty: number;
    message: string;
}

export default function StaffImportForm() {
    const {
        suppliers, products,
        supplierId, setSupplierId,
        importDate, setImportDate,
        lines,
        note,
        setNote,
        isSubmitting,
        grandTotal,
        fetchData, addLine, removeLine, updateLine, addFromSuggestion, handleSubmit
    } = useStaffImportForm();

    const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
    const [aiLoading, setAiLoading] = useState(false);

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

    useEffect(() => {
        fetchData();
        fetchAiSuggestions();
    }, [fetchData]);

    const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                styles={{
                    body: {
                        overflowX: 'auto',
                        padding: '12px',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#a78bfa transparent',
                        maxWidth: '80vw'
                    }
                }}
                style={{ background: '#f5f3ff', borderColor: '#a78bfa', minWidth: 0 }}
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
                    <div style={{ display: 'flex', gap: 12 }}>
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


            <div className={styles.card}>
                {/* Form Product List Table */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: "200px" }}>Vật liệu</th>
                                <th style={{ width: "150px" }}>Số Lượng</th>
                                <th style={{ width: "200px" }}>Giá Nhập</th>
                                <th style={{ width: "200px" }}>Thành Tiền</th>
                                <th style={{ width: "60px", textAlign: 'center' }}>✕</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lines.length === 0 ? (
                                <tr><td colSpan={5} className={styles.emptyState}>Chưa có vật liệu nào được thêm vào danh sách.</td></tr>
                            ) : lines.map(line => (
                                <tr key={line.id}>
                                    <td>
                                        <Select
                                            showSearch
                                            placeholder="-- Chọn vật liệu --"
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                                            }
                                            style={{ width: '100%' }}
                                            value={line.product_id || undefined}
                                            onChange={val => updateLine(line.id, 'product_id', val)}
                                            options={products.map(p => ({
                                                value: p.id,
                                                label: `${p.name} (Tồn hiện tại: ${p.stock})`
                                            }))}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            className={styles.rowInput}
                                            value={line.quantity}
                                            onChange={e => updateLine(line.id, 'quantity', e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            min="0"
                                            className={styles.rowInput}
                                            value={line.unit_price}
                                            onChange={e => updateLine(line.id, 'unit_price', e.target.value)}
                                            disabled
                                        />
                                    </td>
                                    <td className={styles.totalText}>
                                        {formatVND(Number(line.quantity) * Number(line.unit_price) || 0)} đ
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <button className={styles.actionBtn} onClick={() => removeLine(line.id)} title="Xóa dòng này">
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className={styles.addBtn} onClick={addLine}>
                    + Thêm dòng sản phẩm
                </button>

                <div className={styles.footer}>
                    <div className={styles.grandTotal}>
                        Tổng Tiền: {formatVND(grandTotal)} đ
                    </div>

                    <div className={styles.noteSection} style={{ width: '100%', marginTop: 8 }}>
                        <Text strong style={{ display: 'block', marginBottom: 8 }}>Ghi chú phiếu nhập:</Text>
                        <Input.TextArea
                            rows={3}
                            placeholder="Nhập ghi chú cho phiếu nhập này (tùy chọn)..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            style={{ borderRadius: 8 }}
                        />
                    </div>

                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Đang tạo phiếu..." : "Tạo Phiếu Nhập Kho"}
                    </button>
                </div>
            </div>
        </div>
    );
}
