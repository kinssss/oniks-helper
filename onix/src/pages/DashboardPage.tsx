import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import '../styles/DashboardPage.css';

interface Ticket {
  _id: string;
  teacherName: string;
  cabinet: string;
  problem: string;
  status: 'active' | 'in_progress' | 'pending' | 'completed';
}

const DashboardPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tickets');
        setTickets(response.data);
        setLoading(false);
      } catch (err) {
        let errorMessage = 'Ошибка загрузки тикетов';
        if (axios.isAxiosError(err)) {
          errorMessage += `: ${err.response?.data?.error || err.message}`;
        } else if (err instanceof Error) {
          errorMessage += `: ${err.message}`;
        }
        setError(errorMessage);
        setLoading(false);
        console.error('Error fetching tickets:', err);
      }
    };

    fetchTickets();
  }, []);

  const updateTicketStatus = async (id: string, newStatus: 'active' | 'in_progress' | 'pending' | 'completed') => {
    try {
      await axios.put(`http://localhost:5001/api/tickets/${id}`, 
        { status: newStatus },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      setTickets(tickets.map(ticket => 
        ticket._id === id ? { ...ticket, status: newStatus } : ticket
      ));
    } catch (err) {
      let errorMessage = 'Ошибка обновления статуса';
      if (axios.isAxiosError(err)) {
        errorMessage += `: ${err.response?.data?.error || err.message}`;
      } else if (err instanceof Error) {
        errorMessage += `: ${err.message}`;
      }
      setError(errorMessage);
      console.error('Error updating ticket:', err);
    }
  };

  const statusGroups = {
    active: 'Активные',
    in_progress: 'Взяты в работу',
    pending: 'Отложены',
    completed: 'Завершенные'
  };

  const filteredTickets = activeTab === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === activeTab);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Дашборд тикетов</h1>
        <div className="tabs-container">
          <div className="tabs-wrapper">
            <motion.div 
              className="tabs-track"
              initial={false}
              animate={{
                x: activeTab === 'all' ? 0 : 
                   activeTab === 'active' ? 100 * 1 :
                   activeTab === 'in_progress' ? 100 * 2 :
                   activeTab === 'pending' ? 100 * 3 : 100 * 4,
                width: activeTab === 'all' ? '90px' : '140px'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Все
                {activeTab === 'all' && (
                  <motion.span 
                    className="bubble"
                    layoutId="bubble"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
              
              {Object.entries(statusGroups).map(([key, label]) => (
                <button
                  key={key}
                  className={`tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                  {activeTab === key && (
                    <motion.span 
                      className="bubble"
                      layoutId="bubble"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="dashboard-grid">
        {activeTab === 'all' ? (
          Object.entries(statusGroups).map(([statusKey, statusLabel]) => {
            const groupTickets = tickets.filter(t => t.status === statusKey);
            if (groupTickets.length === 0) return null;

            return (
              <motion.div 
                key={statusKey}
                className="status-column"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="status-title">{statusLabel}</h2>
                <div className="tickets-list">
                  {groupTickets.map((ticket, index) => (
                    <motion.div
                      key={ticket._id}
                      className={`ticket-card ${statusKey}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="ticket-header">
                        <span className="ticket-id">Тикет #{ticket._id.slice(-4)}</span>
                        <span className={`status-badge ${statusKey}`}>
                          {statusKey === 'active' && 'Активный'}
                          {statusKey === 'in_progress' && 'В работе'}
                          {statusKey === 'pending' && 'Отложен'}
                          {statusKey === 'completed' && 'Завершен'}
                        </span>
                      </div>
                      <div className="ticket-body">
                        <p><strong>Кабинет:</strong> {ticket.cabinet}</p>
                        <p><strong>Преподаватель:</strong> {ticket.teacherName}</p>
                        <p><strong>Проблема:</strong> {ticket.problem}</p>
                      </div>
                      <div className="ticket-actions">
                        {statusKey === 'active' && (
                          <button 
                            className="action-btn take-btn"
                            onClick={() => updateTicketStatus(ticket._id, 'in_progress')}
                          >
                            Взять в работу
                          </button>
                        )}
                        {statusKey === 'in_progress' && (
                          <>
                            <button 
                              className="action-btn complete-btn"
                              onClick={() => updateTicketStatus(ticket._id, 'completed')}
                            >
                              Завершить
                            </button>
                            <button 
                              className="action-btn postpone-btn"
                              onClick={() => updateTicketStatus(ticket._id, 'pending')}
                            >
                              Отложить
                            </button>
                          </>
                        )}
                        {statusKey === 'pending' && (
                          <button 
                            className="action-btn take-btn"
                            onClick={() => updateTicketStatus(ticket._id, 'in_progress')}
                          >
                            Возобновить
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="single-column-view">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                key={ticket._id}
                className={`ticket-card ${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="ticket-header">
                  <span className="ticket-id">Тикет #{ticket._id.slice(-4)}</span>
                  <span className={`status-badge ${activeTab}`}>
                    {activeTab === 'active' && 'Активный'}
                    {activeTab === 'in_progress' && 'В работе'}
                    {activeTab === 'pending' && 'Отложен'}
                    {activeTab === 'completed' && 'Завершен'}
                  </span>
                </div>
                <div className="ticket-body">
                  <p><strong>Кабинет:</strong> {ticket.cabinet}</p>
                  <p><strong>Преподаватель:</strong> {ticket.teacherName}</p>
                  <p><strong>Проблема:</strong> {ticket.problem}</p>
                </div>
                <div className="ticket-actions">
                  {activeTab === 'active' && (
                    <button 
                      className="action-btn take-btn"
                      onClick={() => updateTicketStatus(ticket._id, 'in_progress')}
                    >
                      Взять в работу
                    </button>
                  )}
                  {activeTab === 'in_progress' && (
                    <>
                      <button 
                        className="action-btn complete-btn"
                        onClick={() => updateTicketStatus(ticket._id, 'completed')}
                      >
                        Завершить
                      </button>
                      <button 
                        className="action-btn postpone-btn"
                        onClick={() => updateTicketStatus(ticket._id, 'pending')}
                      >
                        Отложить
                      </button>
                    </>
                  )}
                  {activeTab === 'pending' && (
                    <button 
                      className="action-btn take-btn"
                      onClick={() => updateTicketStatus(ticket._id, 'in_progress')}
                    >
                      Возобновить
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;