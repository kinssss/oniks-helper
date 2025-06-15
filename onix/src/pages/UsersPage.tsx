import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit, FiTrash2, FiUpload, FiUser, FiSearch, FiX, FiPlus } from 'react-icons/fi';
import '../styles/UsersPage.css';

interface User {
  _id: string;
  fullName: string;
  login: string;
  role: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    login: '',
    password: ''
  });
  const [importData, setImportData] = useState({
    sheetId: '1Tn45au1l26hwsKOf4Er9mUz2ySOoqgohnMH3FWsmtiA',
    gid: '0'
  });
  const [searchTerm, setSearchTerm] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:5001/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Ошибка при загрузке пользователей');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setImportData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', { ...formData, role: 'teacher' });
      fetchUsers();
      resetForm();
      setError(null);
    } catch (err) {
      handleError(err, 'Ошибка при добавлении пользователя');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUser) {
        await api.put(`/users/${currentUser._id}`, formData);
        fetchUsers();
        closeEditModal();
        setError(null);
      }
    } catch (err) {
      handleError(err, 'Ошибка при обновлении пользователя');
    }
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setFormData({
      fullName: user.fullName,
      login: user.login,
      password: ''
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
        setError(null);
      } catch (err) {
        handleError(err, 'Ошибка при удалении пользователя');
      }
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!importData.sheetId || !importData.gid) {
        setError('Необходимо указать ID таблицы и листа');
        return;
      }

      const response = await api.post('/users/import-from-google-sheets', {
        sheetId: importData.sheetId.trim(),
        gid: importData.gid.trim()
      });

      if (response.data.success) {
        fetchUsers();
        setError(null);
        alert('Импорт успешно завершен');
      } else {
        setError(response.data.message || 'Ошибка при импорте');
      }
    } catch (err) {
      handleError(err, 'Ошибка при импорте пользователей');
    }
  };

  const handleError = (err: unknown, defaultMessage: string) => {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || defaultMessage);
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError(defaultMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      login: '',
      password: ''
    });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentUser(null);
    resetForm();
  };

  const filteredUsers = users.filter(user => {
    if (!user || !user.fullName || !user.login) return false;
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(searchTermLower) ||
      user.login.toLowerCase().includes(searchTermLower)
    );
  });

  if (loading) {
    return (
      <div className="up-container">
        <div className="up-loading">
          <div className="up-spinner"></div>
          <p>Загрузка пользователей...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="up-container">
      <h1 className="up-main-title">Управление пользователями</h1>
      
      {error && (
        <div className="up-error-message">
          <FiUser /> {error}
        </div>
      )}

      <div className="up-top-sections">
        <div className="up-section">
          <h2 className="up-section-title">
            <FiPlus /> Добавить нового пользователя
          </h2>
          <form onSubmit={handleAddUser} className="up-user-form">
            <div className="up-form-group">
              <label className="up-label">ФИО:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="up-input"
                required
              />
            </div>
            <div className="up-form-group">
              <label className="up-label">Логин:</label>
              <input
                type="text"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                className="up-input"
                required
              />
            </div>
            <div className="up-form-group">
              <label className="up-label">Пароль:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="up-input"
                required
              />
            </div>
            <button type="submit" className="up-btn up-btn-primary">
              Добавить
            </button>
          </form>
        </div>
        
        <div className="up-section">
          <h2 className="up-section-title">
            <FiUpload /> Импорт из Google Sheets
          </h2>
          <form onSubmit={handleImport} className="up-import-form">
            <div className="up-form-group">
              <label className="up-label">ID таблицы:</label>
              <input
                type="text"
                name="sheetId"
                value={importData.sheetId}
                onChange={handleImportChange}
                className="up-input"
                required
              />
            </div>
            <div className="up-form-group">
              <label className="up-label">ID листа (gid):</label>
              <input
                type="text"
                name="gid"
                value={importData.gid}
                onChange={handleImportChange}
                className="up-input"
                required
              />
            </div>
            <button type="submit" className="up-btn up-btn-primary">
              Импортировать
            </button>
          </form>
        </div>
      </div>
      
      <div className="up-section up-users-list">
        <div className="up-search-bar">
          <div className="up-form-group" style={{ flexGrow: 1 }}>
            <div className="up-input-with-icon">
              <FiSearch className="up-search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="up-input"
                placeholder="Поиск пользователей..."
              />
            </div>
          </div>
          <div className="up-users-count">
            Найдено: {filteredUsers.length}
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="up-empty-state">
            <FiUser className="up-empty-state-icon" />
            <h3 className="up-empty-state-title">Пользователи не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="up-table-container">
            <table className="up-table">
              <thead>
                <tr>
                  <th>ФИО</th>
                  <th>Логин</th>
                  <th>Роль</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="up-user-info">
                        <div className="up-user-avatar">
                          {user.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="up-user-name">{user.fullName}</div>
                          <div className="up-user-login">@{user.login}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.login}</td>
                    <td>
                      <span className={`up-role-badge ${user.role === 'admin' ? 'up-role-admin' : ''}`}>
                        {user.role === 'admin' ? 'Администратор' : 'Преподаватель'}
                      </span>
                    </td>
                    <td>
                      <div className="up-actions">
                        <button 
                          onClick={() => handleEdit(user)} 
                          className="up-action-btn up-edit-btn"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(user._id)} 
                          className="up-action-btn up-delete-btn"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Модальное окно редактирования */}
      {isEditModalOpen && (
        <div className="up-modal-overlay">
          <div className="up-modal">
            <div className="up-modal-header">
              <h3>Редактировать пользователя</h3>
              <button onClick={closeEditModal} className="up-modal-close">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="up-user-form">
              <div className="up-form-group">
                <label className="up-label">ФИО:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="up-input"
                  required
                />
              </div>
              <div className="up-form-group">
                <label className="up-label">Логин:</label>
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  className="up-input"
                  required
                />
              </div>
              <div className="up-form-group">
                <label className="up-label">Новый пароль (оставьте пустым, чтобы не менять):</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="up-input"
                />
              </div>
              <div className="up-form-actions">
                <button type="submit" className="up-btn up-btn-primary">
                  Обновить
                </button>
                <button 
                  type="button" 
                  onClick={closeEditModal} 
                  className="up-btn up-btn-secondary"
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;