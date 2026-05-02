import { useEffect, useState } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffImportForm from "../../components/staff/import/StaffImportForm";
import StaffImportListTab from "../../components/staff/import/StaffImportListTab";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import { Tabs, Card, Tag, Typography, Space, Button, Tooltip } from "antd";
import { ImportOutlined, RobotOutlined, CiOutlined, BulbOutlined, ReloadOutlined, ArrowRightOutlined } from "@ant-design/icons";
import axiosClient from "../../api/axiosClient";
import styles from "./StaffImportPage.module.css";

const { Text } = Typography;


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
