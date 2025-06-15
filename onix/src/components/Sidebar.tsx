import React from 'react';
import { FiHome, FiMessageSquare, FiSettings, FiFileText, FiLogOut, FiMessageCircle, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import './Sidebar.css';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="logo-container">
          <img src={logo} alt="Оникс" className="sidebar-logo" />
          <h2>Оникс. Помощник</h2>
        </div>
        <nav>
          <ul>
            <li
              className={activePage === 'dashboard' ? 'active' : ''}
              onClick={() => setActivePage('dashboard')}
            >
              <FiHome /> <span>Главная</span>
            </li>
            <li
              className={activePage === 'tickets' ? 'active' : ''}
              onClick={() => setActivePage('tickets')}
            >
              <FiFileText /> <span>Тикеты</span>
            </li>
            <li
              className={activePage === 'requests' ? 'active' : ''}
              onClick={() => setActivePage('requests')}
            >
              <FiMessageSquare /> <span>Заявки</span>
            </li>
            <li
              className={activePage === 'chat-content' ? 'active' : ''}
              onClick={() => setActivePage('chat-content')}
            >
              <FiSettings /> <span>Управление ботом</span>
            </li>
            <li
              className={activePage === 'users' ? 'active' : ''}
              onClick={() => setActivePage('users')}
            >
              <FiUsers /> <span>Пользователи</span>
            </li>
            <li
              className={activePage === 'feedback' ? 'active' : ''}
              onClick={() => setActivePage('feedback')}
            >
              <FiMessageCircle /> <span>Обратная связь</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="logout-button" onClick={handleLogout}>
        <FiLogOut /> <span>Выход</span>
      </div>
    </div>
  );
};

export default Sidebar;