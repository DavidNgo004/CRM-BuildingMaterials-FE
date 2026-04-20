import { useEffect } from "react";
import styles from "./StaffImportForm.module.css";
import { useStaffImportForm } from "../../../hooks/import/useStaffImportForm";

export default function StaffImportForm() {
    const {
        suppliers, products,
        supplierId, setSupplierId,
        importDate, setImportDate,
        lines, isSubmitting, grandTotal,
        fetchData, addLine, removeLine, updateLine, handleSubmit
    } = useStaffImportForm();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);

    return (
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
                                    <select
                                        className={styles.rowSelect}
                                        value={line.product_id}
                                        onChange={e => updateLine(line.id, 'product_id', e.target.value)}
                                    >
                                        <option value="">-- Chọn vật liệu --</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Tồn hiện tại: {p.stock})</option>
                                        ))}
                                    </select>
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
                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang tạo phiếu..." : "Tạo Phiếu Nhập Kho"}
                </button>
            </div>
        </div>
    );
}
