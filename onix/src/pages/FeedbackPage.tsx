import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiRefreshCw, FiStar, FiTrash2, FiSearch, FiChevronLeft } from 'react-icons/fi';
import '../styles/FeedbackPage.css';

interface Feedback {
  _id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  isImportant?: boolean;
}

const FeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchQuery, activeFolder]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/feedback');
      setFeedbacks(response.data.data);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить отзывы. Попробуйте позже.');
      console.error('Ошибка при загрузке отзывов:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let result = [...feedbacks];
    
    if (activeFolder === 'important') {
      result = result.filter(f => f.isImportant);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.message.toLowerCase().includes(query) ||
        f.phone.includes(query)
      );
    }
    
    setFilteredFeedbacks(result);
  };

  const toggleImportant = async (id: string) => {
    try {
      const updatedFeedbacks = feedbacks.map(f => 
        f._id === id ? { ...f, isImportant: !f.isImportant } : f
      );
      
      setFeedbacks(updatedFeedbacks);
      
      await axios.patch(`http://localhost:5001/api/feedback/${id}`, {
        isImportant: !feedbacks.find(f => f._id === id)?.isImportant
      });
    } catch (err) {
      console.error('Ошибка при обновлении:', err);
      fetchFeedbacks();
    }
  };

  const deleteMessages = async (ids: string[]) => {
    try {
      await axios.delete('http://localhost:5001/api/feedback', {
        data: { ids }
      });
      
      setFeedbacks(feedbacks.filter(f => !ids.includes(f._id)));
      setSelectedMessages([]);
      if (selectedFeedback && ids.includes(selectedFeedback._id)) {
        setSelectedFeedback(null);
      }
    } catch (err) {
      console.error('Ошибка при удалении:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleSelectMessage = (id: string) => {
    setSelectedMessages(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id) 
        : [...prev, id]
    );
  };

  const selectAllMessages = () => {
    if (selectedMessages.length === filteredFeedbacks.length) {
      setSelectedMessages([]);
    } else {
      setSelectedMessages(filteredFeedbacks.map(f => f._id));
    }
  };

  if (loading) return (
    <div className="feedback-container" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="loading-state">
        <div className="spinner"></div>
        <span>Загрузка сообщений...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="feedback-container" style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="error-message">
        <span>{error}</span>
        <button onClick={fetchFeedbacks}>Попробовать снова</button>
      </div>
    </div>
  );

  return (
    <div className="feedback-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="feedback-header">
        <h1 className="feedback-title">Обратная связь</h1>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Поиск сообщений..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="feedback-layout" style={{ flex: 1, minHeight: 0 }}>
        <div className="feedback-sidebar" style={{ height: '100%', overflowY: 'auto' }}>
          <button className="refresh-btn" onClick={fetchFeedbacks}>
            <FiRefreshCw /> Обновить
          </button>
          
          <div className="folder-list">
            <div 
              className={`folder-item ${activeFolder === 'inbox' ? 'active' : ''}`}
              onClick={() => setActiveFolder('inbox')}
            >
              <div className="folder-icon">📥</div>
              <span>Входящие</span>
              <span className="folder-badge">{feedbacks.length}</span>
            </div>
            
            <div 
              className={`folder-item ${activeFolder === 'important' ? 'active' : ''}`}
              onClick={() => setActiveFolder('important')}
            >
              <div className="folder-icon">
                <FiStar />
              </div>
              <span>Важные</span>
              <span className="folder-badge">{feedbacks.filter(f => f.isImportant).length}</span>
            </div>
          </div>
        </div>

        <div className="feedback-content" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {selectedFeedback ? (
            <div className="feedback-detail-view" style={{ flex: 1, overflowY: 'auto' }}>
              <div className="detail-header">
                <button className="back-btn" onClick={() => setSelectedFeedback(null)}>
                  <FiChevronLeft /> Назад
                </button>
                
                <div className="detail-actions">
                  <button 
                    className={`detail-action-btn ${selectedFeedback.isImportant ? 'active' : ''}`}
                    onClick={() => toggleImportant(selectedFeedback._id)}
                  >
                    <FiStar />
                  </button>
                  <button 
                    className="detail-action-btn delete"
                    onClick={() => deleteMessages([selectedFeedback._id])}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="sender-info">
                <div className="sender-avatar">
                  {selectedFeedback.name.charAt(0).toUpperCase()}
                </div>
                <div className="sender-details">
                  <div className="sender-name">{selectedFeedback.name}</div>
                  <div className="sender-phone">{selectedFeedback.phone}</div>
                </div>
                <div className="message-date">{formatDate(selectedFeedback.createdAt)}</div>
              </div>
              
              <div className="message-content">
                <p>{selectedFeedback.message}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="toolbar">
                <div className="select-all">
                  <input
                    type="checkbox"
                    checked={
                      selectedMessages.length > 0 && 
                      selectedMessages.length === filteredFeedbacks.length
                    }
                    onChange={selectAllMessages}
                  />
                  <button 
                    className="delete-btn"
                    onClick={() => deleteMessages(selectedMessages)}
                    disabled={selectedMessages.length === 0}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              
              <div className="feedback-list" style={{ flex: 1, overflowY: 'auto' }}>
                {filteredFeedbacks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <h3 className="empty-state-title">Нет сообщений</h3>
                    <p>Здесь будут отображаться полученные сообщения</p>
                  </div>
                ) : (
                  filteredFeedbacks.map(feedback => (
                    <div 
                      key={feedback._id}
                      className={`feedback-item ${selectedMessages.includes(feedback._id) ? 'selected' : ''}`}
                      onClick={() => setSelectedFeedback(feedback)}
                    >
                      <div className="feedback-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedMessages.includes(feedback._id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectMessage(feedback._id);
                          }}
                        />
                      </div>
                      
                      <div 
                        className={`feedback-star ${feedback.isImportant ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleImportant(feedback._id);
                        }}
                      >
                        <FiStar />
                      </div>
                      
                      <div className="feedback-content-wrapper">
                        <div className="feedback-header-row">
                          <div className="feedback-sender">{feedback.name}</div>
                          <div className="feedback-date">{formatDate(feedback.createdAt)}</div>
                        </div>
                        
                        <div className="feedback-preview">
                          {feedback.message.length > 120
                            ? `${feedback.message.substring(0, 120)}...`
                            : feedback.message}
                        </div>
                        
                        <div className="feedback-phone">{feedback.phone}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;