import { useEffect } from "react";
import { useAuth } from "../../store/authContext";
import { useNavigate } from "react-router-dom";

export default function StaffDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };
    useEffect(() => {
        document.title = 'Dashboard - Kho VLXD  ';
    }, []);
    return (
        <div>
            <h1>Dashboard - Kho VLXD</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}