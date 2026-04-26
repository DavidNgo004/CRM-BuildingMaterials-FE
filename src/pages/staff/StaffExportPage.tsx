import { useEffect } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffExportForm from "../../components/staff/export/StaffExportForm";
import styles from "./StaffImportPage.module.css";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";

export default function StaffExportPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Tạo phiếu xuất - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className={styles.page}>
                <h2 className={styles.pageTitle}>Tạo Phiếu Xuất Kho</h2>
                <StaffExportForm />
            </div>
        </StaffLayout>
    );
}
