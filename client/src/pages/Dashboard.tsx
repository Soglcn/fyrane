// client/src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
    username: string;
    role: string;
    companyId: string;
    fullname: string;
    email: string;
}

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserInfo | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser: UserInfo = JSON.parse(storedUser);
                setUser(parsedUser);

                if (parsedUser.fullname) {
                    document.title = `${parsedUser.fullname}'s Dashboard`;
                } else {
                    document.title = `FyraneCloud - Dashboard`;
                }

            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                handleLogout();
            }
        } else {
            navigate('/');
            document.title = `FyraneCloud - Login`;
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setUser(null);
        document.title = `FyraneCloud - Login`;
        navigate('/');
    };

    if (!user) {
        return <div className="loading-screen">Loading user data...</div>;
    }

    const userRole = user.role;

    return (
        <div className="dashboard-container">
            {userRole === 'godmin' && (
                <div className="godmin-specific-content">
                    <h3>Godmin Özel Bölümü</h3>
                    <p>Sistem yönetimi ve ana kontroller burada yer alır.</p>
                </div>
            )}

            {userRole === 'manager' && (
                <div className="manager-specific-content">
                    <h3>Yöneticiye Özel Bölüm</h3>
                    <p>Burada yöneticilere özel bilgiler veya araçlar gösterilebilir.</p>
                </div>
            )}

            <button onClick={handleLogout} className="cust-button">Logout</button>
        </div>
    );
}

export default Dashboard;