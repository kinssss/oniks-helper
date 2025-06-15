import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TicketsPage.css';

interface Ticket {
  _id: string;
  teacherName: string;
  cabinet: string;
  problem: string;
  status: 'active' | 'in_progress' | 'pending' | 'completed';
}

const TicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tickets`);
        setTickets(res.data);
      } catch (error) {
        console.error('Ошибка при загрузке тикетов:', error);
      }
    };
    fetchTickets();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/tickets/${id}`, { status: newStatus });
      setTickets(
        tickets.map((t) =>
          t._id === id ? { ...t, status: newStatus as any } : t
        )
      );
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#ff9800';
      case 'in_progress': return '#2196f3';
      case 'pending': return '#9c27b0';
      case 'completed': return '#4caf50';
      default: return '#607d8b';
    }
  };

  return (
    <div className="tp-container">
      <h2 className="tp-title">Тикеты</h2>
      <div className="tp-table-container">
        <table className="tp-table">
          <thead className="tp-table-header">
            <tr>
              <th className="tp-th">ID</th>
              <th className="tp-th">Преподаватель</th>
              <th className="tp-th">Кабинет</th>
              <th className="tp-th">Проблема</th>
              <th className="tp-th">Статус</th>
            </tr>
          </thead>
          <tbody className="tp-table-body">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="tp-tr">
                <td className="tp-td">{ticket._id}</td>
                <td className="tp-td">{ticket.teacherName}</td>
                <td className="tp-td">{ticket.cabinet}</td>
                <td className="tp-td">{ticket.problem}</td>
                <td className="tp-td">
                  <select
                    className="tp-select"
                    value={ticket.status}
                    onChange={(e) => updateStatus(ticket._id, e.target.value)}
                    style={{ backgroundColor: getStatusColor(ticket.status) }}
                  >
                    <option value="active" className="tp-option">Активный</option>
                    <option value="in_progress" className="tp-option">В работе</option>
                    <option value="pending" className="tp-option">Отложен</option>
                    <option value="completed" className="tp-option">Завершен</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketsPage;