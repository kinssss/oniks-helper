import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RequestsPage.css';

interface Request {
  _id: string;
  studentName: string;
  phone: string;
  group?: string;
  district?: string;
  birthDate?: string;
  requestType: string;
  status?: string;
  createdAt?: string;
}

const RequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/requests');
        
        // Проверяем структуру ответа
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          setRequests(response.data.data);
        } else {
          setError('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to fetch requests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (requests.length === 0) return <div>No requests found</div>;

  return (
    <div className="rp-container">
      <h2 className="rp-title">Заявки на справки</h2>
      <div className="rp-table-container">
        <table className="rp-table">
          <thead className="rp-table-header">
            <tr>
              <th className="rp-th">ID</th>
              <th className="rp-th">ФИО студента</th>
              <th className="rp-th">Телефон</th>
              <th className="rp-th">Группа</th>
              <th className="rp-th">Район</th>
              <th className="rp-th">Дата рождения</th>
              <th className="rp-th">Тип справки</th>
            </tr>
          </thead>
          <tbody className="rp-table-body">
            {requests.map((req) => (
              <tr key={req._id} className="rp-tr">
                <td className="rp-td">{req._id.substring(0, 6)}...</td>
                <td className="rp-td">{req.studentName}</td>
                <td className="rp-td">{req.phone}</td>
                <td className="rp-td">{req.group || '-'}</td>
                <td className="rp-td">{req.district || '-'}</td>
                <td className="rp-td">{req.birthDate ? new Date(req.birthDate).toLocaleDateString() : '-'}</td>
                <td className="rp-td">{req.requestType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestsPage;