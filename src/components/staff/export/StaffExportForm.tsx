import { useEffect, useState } from "react";
import styles from "./StaffExportForm.module.css";
import { useStaffExportForm } from "../../../hooks/export/useStaffExportForm";
import { Switch } from "antd";

export default function StaffExportForm() {
    const {
        customers, products,
        customerId, setCustomerId,
        exportDate, setExportDate,
        lines, isSubmitting, grandTotal,
        fetchData, addLine, removeLine, updateLine, handleSubmit,
        // New customer fields
        newCustomerName, setNewCustomerName,
        newCustomerPhone, setNewCustomerPhone,
        newCustomerEmail, setNewCustomerEmail,
        newCustomerAddress, setNewCustomerAddress,
        newCustomerType, setNewCustomerType,
        isNewCustomer, setIsNewCustomer,
    } = useStaffExportForm();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatVND = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);

    return (
        <div className={styles.card}>
            <div className={styles.formGrid}>
                {/* Customer Toggle */}
                <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label className={styles.formLabel}>Loại khách hàng</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                        <span style={{ color: !isNewCustomer ? '#4f46e5' : '#94a3b8', fontWeight: !isNewCustomer ? 600 : 400 }}>
                            Khách hàng có sẵn
                        </span>
                        <Switch
                            checked={isNewCustomer}
                            onChange={checked => setIsNewCustomer(checked)}
                            style={{ background: isNewCustomer ? '#4f46e5' : '#94a3b8' }}
                        />
                        <span style={{ color: isNewCustomer ? '#4f46e5' : '#94a3b8', fontWeight: isNewCustomer ? 600 : 400 }}>
                            Khách hàng mới
                        </span>
                    </div>
                </div>

                {/* Existing Customer */}
                {!isNewCustomer ? (
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Chọn khách hàng</label>
                        <select
                            className={styles.formControl}
                            value={customerId}
                            onChange={(e) => setCustomerId(Number(e.target.value) || "")}
                        >
                            <option value="">-- Chọn khách hàng --</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Tên khách hàng mới</label>
                            <input
                                type="text"
                                className={styles.formControl}
                                placeholder="Nhập tên khách hàng..."
                                value={newCustomerName}
                                onChange={e => setNewCustomerName(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Số điện thoại</label>
                            <input
                                type="text"
                                className={styles.formControl}
                                placeholder="Số điện thoại (tùy chọn)..."
                                value={newCustomerPhone}
                                onChange={e => setNewCustomerPhone(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Địa chỉ</label>
                            <input
                                type="text"
                                className={styles.formControl}
                                placeholder="Địa chỉ (tùy chọn)..."
                                value={newCustomerAddress}
                                onChange={e => setNewCustomerAddress(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Email</label>
                            <input
                                type="email"
                                className={styles.formControl}
                                placeholder="Email (tùy chọn)..."
                                value={newCustomerEmail}
                                onChange={e => setNewCustomerEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Loại khách hàng</label>
                            <select
                                className={styles.formControl}
                                value={newCustomerType}
                                onChange={e => setNewCustomerType(e.target.value)}
                            >
                                <option value="">-- Chọn loại khách hàng --</option>
                                <option value="Khách hàng bán lẻ">Khách hàng bán lẻ</option>
                                <option value="Khách hàng mua số lượng lớn">Khách hàng mua số lượng lớn</option>
                            </select>
                        </div>
                    </>
                )}
            </div>

            {/* Product Lines */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: "200px" }}>Vật liệu</th>
                            <th style={{ width: "120px" }}>Số Lượng</th>
                            <th style={{ width: "180px" }}>Đơn Giá</th>
                            <th style={{ width: "180px" }}>Thành Tiền</th>
                            <th style={{ width: "50px", textAlign: 'center' }}>✕</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lines.length === 0 ? (
                            <tr><td colSpan={5} className={styles.emptyState}>Chưa có vật liệu nào được thêm.</td></tr>
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
                                            <option key={p.id} value={p.id}>{p.name} (Tồn: {p.stock})</option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input type="number" min="1" className={styles.rowInput}
                                        value={line.quantity}
                                        onChange={e => updateLine(line.id, 'quantity', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input type="number" min="0" className={styles.rowInput}
                                        value={line.unit_price}
                                        onChange={e => updateLine(line.id, 'unit_price', e.target.value)}
                                    />
                                </td>
                                <td className={styles.totalText}>
                                    {formatVND(Number(line.quantity) * Number(line.unit_price) || 0)} đ
                                </td>
                                <td style={{ textAlign: 'center' }}>
                                    <button className={styles.actionBtn} onClick={() => removeLine(line.id)} title="Xóa">✕</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className={styles.addBtn} onClick={addLine}>+ Thêm dòng sản phẩm</button>

            <div className={styles.footer}>
                <div className={styles.grandTotal}>
                    Tổng Tiền: {formatVND(grandTotal)} đ
                </div>
                <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Đang tạo phiếu..." : "Tạo Phiếu Xuất Kho"}
                </button>
            </div>
        </div>
    );
}
