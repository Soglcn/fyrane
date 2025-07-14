import { useNavigate } from 'react-router-dom';
import FyraneLogo from '../assets/media/FyraneCloudLogo-Colored.png';


function HomePage() {
    const navigate = useNavigate(); 

    const handleLoginClick = () => {navigate('/login');};
    const handleApiStatusClick = () => {navigate('/APIStatus');};

    return (
        <div className="tempPanel">
            <img src={FyraneLogo} alt="FyraneCloud Logo" className="tempLogo" />

            <button onClick={handleLoginClick} className="cust-button">Login</button>
            <button onClick={handleApiStatusClick} className="cust-button">API Status</button>
        </div>
    )
}

export default HomePage;