import { useEffect } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffImportForm from "../../components/staff/import/StaffImportForm";
import StaffImportListTab from "../../components/staff/import/StaffImportListTab";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import { Tabs } from "antd";
import { ImportOutlined, CiOutlined } from "@ant-design/icons";
import styles from "./StaffImportPage.module.css";


export default function StaffImportPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Nhập kho - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const tabItems = [
        {
            key: 'create',
            label: <span><ImportOutlined /> Tạo Phiếu Nhập</span>,
            children: <StaffImportForm />,
        },
        {
            key: 'list',
            label: <span><CiOutlined /> Danh Sách Đơn Nhập</span>,
            children: <StaffImportListTab />,
        },
    ];

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className={styles.page}>
                <h2 className={styles.pageTitle}>Quản lý Nhập Kho</h2>
                <Tabs defaultActiveKey="create" items={tabItems} size="large" />
            </div>
        </StaffLayout>
    );
}
