import { useEffect } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import StaffImportForm from "../../components/staff/import/StaffImportForm";
import styles from "./StaffImportPage.module.css";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";

export default function StaffImportPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Tạo phiếu nhập - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <StaffLayout onLogout={handleLogout}>
            <div className={styles.page}>
                <h2 className={styles.pageTitle}>Tạo Phiếu Nhập Kho</h2>
                <StaffImportForm />
            </div>
        </StaffLayout>
    );
}
