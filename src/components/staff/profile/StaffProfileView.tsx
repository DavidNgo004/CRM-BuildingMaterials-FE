import { UserOutlined } from '@ant-design/icons';
import styles from './StaffProfileView.module.css';

interface StaffProfileViewProps {
    name: string;
    email: string;
    onChangePasswordClick: () => void;
}

export default function StaffProfileView({ name, email, onChangePasswordClick }: StaffProfileViewProps) {
    return (
        <div className={styles.card}>
            <div className={styles.avatarContainer}>
                <div className={styles.avatar}>
                    <UserOutlined />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Họ & Tên:</label>
                <input 
                    type="text" 
                    className={styles.formInput} 
                    value={name} 
                    readOnly 
                />
            </div>

            <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email:</label>
                <input 
                    type="text" 
                    className={styles.formInput} 
                    value={email} 
                    readOnly 
                />
            </div>

            <button className={styles.changePwdBtn} onClick={onChangePasswordClick}>
                Đổi Mật Khẩu
            </button>
        </div>
    );
}
