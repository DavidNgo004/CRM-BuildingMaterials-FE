import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    return (
        <div>
            <h1>Staff Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}