import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import userpp from '../assets/media/adminpp.jpeg';

interface UserInfo {
  username: string;
  fullname: string;
}

function RightPanel() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [buttonsExpanded, setButtonsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'notifications' | 'messages'>('notifications');
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: UserInfo = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    navigate('/');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        expanded &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setExpanded(false);
        setButtonsExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  const toggleExpand = () => {
    setExpanded(prev => !prev);
    if (expanded) {
      setButtonsExpanded(false);
    }
  };

  const toggleButtons = (e: React.MouseEvent) => {
    e.stopPropagation();
    setButtonsExpanded(prev => !prev);
  };

  const username = user?.username || 'Loading...';

  return (
    <div
      ref={panelRef}
      className={`right-panel ${expanded ? 'expanded' : ''}`}
    >
      <div
        className={`profile-panel ${buttonsExpanded ? 'active-bg' : ''}`}
        onClick={toggleExpand}
        style={{ cursor: 'pointer' }}
      >

        <div className="profile-title">
          <div className='show-pp'>
            <img className='user-pp' src={userpp} alt="User Profile" />
            <span className="tooltip-text">Show profile</span>
          </div>
          <div className='show-un' onClick={toggleButtons} style={{ userSelect: 'none' }}>
            {username}{' '}
            <span
              style={{
                display: 'inline-block',
                transform: buttonsExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s ease',
                fontSize: '16px',
                marginLeft: '5px',
              }}
            >
              ▼
            </span>
          </div>
        </div>
      </div>

      <div className={`profile-buttons ${buttonsExpanded ? 'expanded' : ''}`}>
        <button className="pr-button">Manage Users</button>
        <button className="pr-button">Tasks</button>
        <button className="pr-button">Help</button>
        <button className="pr-button">Settings</button>
        <button onClick={handleLogout} className="pr-button" id="logout-btn">
          Logout
        </button>
      </div>

      <div className="chat-panel">
        <div className="chat-tabs">
          <div
            className={`chat-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </div>
          <div
            className={`chat-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </div>
        </div>

        {activeTab === 'notifications' && (
          <div className="notifications">Notifications content here</div>
        )}
        {activeTab === 'messages' && (
          <div className="messages">Messages content here</div>
        )}
      </div>

    </div>
  );
}

export default RightPanel;
