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
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                handleLogout(); 
            }
        } else {
            navigate('/');
        }
    }, [navigate]); 

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        setUser(null); 
        navigate('/Login'); 
    };

    if (!user) {
        return <div className="loading-screen">Loading user data...</div>;
    }


    const userRole = user.role;

    return (
        <div className="dashboard-container">
            {userRole === 'godmin' ? (
                <h1>Merhaba Godmin!</h1>
            ) : (
                <h1>Merhaba Pleb!</h1>
            )}
            
            <p>Giriş yapan kullanıcı: {user.username}</p>
            <p>Rolün: {userRole.toUpperCase()}</p>

            <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
    );
}

export default Dashboard;