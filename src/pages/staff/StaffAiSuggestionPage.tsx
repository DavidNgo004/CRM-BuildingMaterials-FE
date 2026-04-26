import { useEffect } from "react";
import StaffLayout from "../../components/staff/StaffLayout";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";
import { Result, Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';

export default function StaffAiSuggestionPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "AI Gợi ý nhập kho - Kho VLXD";
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <StaffLayout onLogout={handleLogout}>
            <div style={{ 
                height: 'calc(100vh - 150px)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <Result
                    icon={<RobotOutlined style={{ color: '#4f46e5', fontSize: '72px' }} />}
                    title="Tính năng AI đang được phát triển"
                    subTitle="Hệ thống đang được huấn luyện để đưa ra gợi ý nhập kho tối ưu nhất dựa trên dữ liệu kinh doanh của bạn."
                    extra={
                        <Button type="primary" onClick={() => navigate('/staff/dashboard')} style={{ background: '#4f46e5', borderRadius: 8 }}>
                            Quay lại Dashboard
                        </Button>
                    }
                />
            </div>
        </StaffLayout>
    );
}
