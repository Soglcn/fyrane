import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FyraneLogo from '../assets/media/FyraneCloudLogo-Colored.png';
import RigelcoreLogo from '../assets/media/RigelcoreLogo-Colored.png';

function Login() {
    const [companyId, setCompanyId] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false); 

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/Dashboard');
    };

    return (
        <div className='loginPanel'>
            <img src={FyraneLogo} alt="FyraneCloud Logo" className="loginLogo" />
            <img src={RigelcoreLogo} alt="FyraneCloud Logo" className="rigelLogo" />

            <p className={`wrongInputs ${showErrorMessage ? 'show' : ''}`}>Oops! The details don't quite match. Could you double-check your company ID, username, or password?</p>

            <input type="text"
                className="loginInput"
                id='cidInput'
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder='Company ID'
            />

            <input type="text"
                className="loginInput"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='@username'
            />

            <input type="password"
                className="loginInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
            />

            <button onClick={handleLoginClick} className="cust-button" id='loginButton'>Login</button>

            <div className='rememberMeContainer'>
                <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember Me</label>
            </div>

            <div className='troubleLogin'>
                <p className='forgotPassword'>Forgot your password? <span className='highlightLink'>Click here to save your account!</span></p>
                <p className='forgotPassword'>Do you want to be a part of the Fyrane? <span className='highlightLink'>Click here for plans!</span></p>
            </div>
        </div>

    )
}

export default Login;