// client/src/components/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CoreTest from '../components/CoreStatus';
import TotalDiskStats from '../components/TotalDiskStats';
import RigelcoreLogo from '../assets/media/RigelcoreLogo-Colored.png';

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
    const fullname = user?.fullname || 'Guest';


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

    const getGreeting = () => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) return '☕ Good Morning';
        if (hour >= 12 && hour < 17) return '🌞 Have a Good Day';
        if (hour >= 17 && hour < 21) return '😎 Good Afternoon';
        return '🌝 Good Night';
    };

    const greeting = getGreeting();



    const userRole = user.role;

    return (
        <div className="dashboard-container">
            {userRole === 'godmin' && (
                <div className="dash-content">
                    <div className='greetings-dash'>
                        <h1>
                            <span className='gr-day'>
                                {greeting}
                            </span>
                            <br />
                            <span className='un-dash'>
                                {fullname}
                            </span>
                        </h1>
                    </div>

                    <div className='dash-elements'>
                        <div className='showDashElement'>
                            <h3 className='element-title'> API Status</h3>
                            <CoreTest />
                        </div>
                        <div className='showDashElement'>
                            <h3 className='element-title'> Disk Status</h3>
                            <TotalDiskStats />
                        </div>

                    </div>
                </div>
            )
            }

            {
                userRole === 'manager' && (
                    <div className="dash-content">
                        <h3>Yöneticiye Özel Bölüm</h3>
                        <p>Burada yöneticilere özel bilgiler veya araçlar gösterilebilir.</p>
                    </div>
                )
            }

            <button onClick={handleLogout} className="cust-button" id='logoutbtn'>Logout</button>
            <div className='rigelArea'><img src={RigelcoreLogo} alt="FyraneCloud Logo" className="dashLogo" /></div>

        </div >
    );
}

export default Dashboard;