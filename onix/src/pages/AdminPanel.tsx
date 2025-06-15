import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardPage from './DashboardPage';
import TicketsPage from './TicketsPage';
import RequestsPage from './RequestsPage';
import AdminChatContent from './AdminChatContent';
import FeedbackPage from './FeedbackPage';
import UsersPage from './UsersPage';
import '../styles/AdminPanel.css';

const AdminPanel: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="admin-panel">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="admin-content">
        {activePage === 'dashboard' && <DashboardPage />}
        {activePage === 'tickets' && <TicketsPage />}
        {activePage === 'requests' && <RequestsPage />}
        {activePage === 'chat-content' && <AdminChatContent />}
        {activePage === 'feedback' && <FeedbackPage />}
        {activePage === 'users' && <UsersPage />}
      </div>
    </div>
  );
};

export default AdminPanel;