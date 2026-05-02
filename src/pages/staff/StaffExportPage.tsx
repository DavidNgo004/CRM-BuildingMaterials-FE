import { useEffect } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffExportForm from "../../components/staff/export/StaffExportForm";
import StaffExportListTab from "../../components/staff/export/StaffExportListTab";
import { Tabs } from "antd";
import { ExportOutlined, CiOutlined } from "@ant-design/icons";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import styles from "./StaffImportPage.module.css";

export default function StaffExportPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Xuất kho - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const tabItems = [
        {
            key: 'create',
            label: <span><ExportOutlined /> Tạo Phiếu Xuất</span>,
            children: <StaffExportForm />,
        },
        {
            key: 'list',
            label: <span><CiOutlined /> Danh Sách Đơn Xuất</span>,
            children: <StaffExportListTab />,
        },
    ];

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className={styles.page}>
                <h2 className={styles.pageTitle}>Quản lý Xuất Kho</h2>
                <Tabs defaultActiveKey="create" items={tabItems} size="large" />
            </div>
        </StaffLayout>
    );
}
