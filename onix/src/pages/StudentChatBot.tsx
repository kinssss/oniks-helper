import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/StudentChatBot.css';

interface ChatMessage {
  sender: 'user' | 'bot' | 'buttons';
  content: React.ReactNode;
}

export type Request = {
  id: number;
  studentName: string;
  phone: string;
  group: string;
  district: string;
  birthDate: string;
  requestType: string;
};

type Feedback = {
  id: number;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
};

const StudentChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requestData, setRequestData] = useState<Omit<Request, 'id'>>({
    studentName: '',
    phone: '',
    group: '',
    district: '',
    birthDate: '',
    requestType: ''
  });

  const [feedbackData, setFeedbackData] = useState<Omit<Feedback, 'id' | 'createdAt'>>({
    name: '',
    phone: '',
    message: ''
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const showMainMenuButtons = () => {
    return (
      <motion.div 
        className="quick-actions-grid"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <motion.button 
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleButtonClick('Как получить справку')}
          className="quick-action-btn"
        >
          <span>Получить справку</span>
        </motion.button>
        <motion.button 
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleButtonClick('Где учебная часть')}
          className="quick-action-btn"
        >
          <span>Учебная часть</span>
        </motion.button>
        <motion.button 
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleButtonClick('Расписание')}
          className="quick-action-btn"
        >
          <span>Расписание</span>
        </motion.button>
        <motion.button 
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleButtonClick('Еще')}
          className="quick-action-btn"
        >
          <span>Еще</span>
        </motion.button>
      </motion.div>
    );
  };

  const BackToMenuButton = () => {
    return (
      <motion.button 
        whileHover={{ y: -3, backgroundColor: '#f0f0f0' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          setMessages(prev => [...prev.filter(msg => msg.sender !== 'buttons'), {
            sender: 'buttons',
            content: showMainMenuButtons()
          }]);
        }}
        className="back-to-menu-btn"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Назад в меню</span>
      </motion.button>
    );
  };

  useEffect(() => {
    setMessages([
      { 
        sender: 'bot', 
        content: (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bot-message-content"
          >
            <div className="bot-message-text">
              Здравствуйте! Я ваш виртуальный помощник. Чем могу помочь?
            </div>
          </motion.div>
        )
      },
      {
        sender: 'buttons',
        content: showMainMenuButtons()
      }
    ]);
  }, []);

  const handleButtonClick = (question: string) => {
    // Удаляем все предыдущие кнопки
    setMessages(prev => prev.filter(msg => msg.sender !== 'buttons'));
    
    if (question !== 'Еще') {
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'user', 
          content: (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="user-message-content"
            >
              {question}
            </motion.div>
          )
        }
      ]);
      
      setIsTyping(true);
    }
    
    setTimeout(() => {
      let answer: React.ReactNode = '';
      let buttons: React.ReactNode = null;
      
      if (question === 'Как получить справку') {
        answer = (
          <div className="bot-message-text">
            Вы можете заказать справку прямо здесь. Доступны следующие виды:
            <ul className="documents-list">
              <li>Справка об обучении</li>
              <li>Справка о стипендии</li>
              <li>Справка для военкомата</li>
            </ul>
          </div>
        );
        buttons = (
          <div className="action-buttons-container">
            <motion.button 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowRequestModal(true);
                handleButtonClick('Заказать справку');
              }}
              className="primary-action-btn"
            >
              Заказать справку
            </motion.button>
            <BackToMenuButton />
          </div>
        );
      } else if (question === 'Заказать справку') {
        answer = (
          <div className="bot-message-text">
            Открываю форму для заказа справки...
          </div>
        );
      } else if (question === 'Где учебная часть') {
        answer = 'Учебная часть находится в главном корпусе, на третьем этаже.';
        buttons = <BackToMenuButton />;
      } else if (question === 'Расписание') {
        answer = 'Расписание занятий можно посмотреть на сайте колледжа или на информационных стендах.';
        buttons = <BackToMenuButton />;
      } else if (question === 'Еще') {
        buttons = (
          <div className="quick-actions-grid">
            <motion.button 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleButtonClick('Контакты')}
              className="quick-action-btn"
            >
              <span>Контакты</span>
            </motion.button>
            <motion.button 
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFeedbackModal(true)}
              className="quick-action-btn"
            >
              <span>Обратная связь</span>
            </motion.button>
            <BackToMenuButton />
          </div>
        );
      } else if (question === 'Контакты') {
        answer = (
          <div className="bot-message-text">
            <table className="contacts-table">
              <thead>
                <tr>
                  <th>Администрация</th>
                  <th>ФИО</th>
                  <th>Телефон</th>
                  <th>E-mail</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Директор</td>
                  <td>Рогова Марина Николаевна</td>
                  <td>8 (342) 244-89-21</td>
                  <td>ppk4@mail.ru</td>
                </tr>
                <tr>
                  <td>И.о. заместителя директора по учебной работе</td>
                  <td>Ведерникова Ирина Дмитриевна</td>
                  <td>8 (342) 236-28-03</td>
                  <td>ppk4@mail.ru</td>
                </tr>
                <tr>
                  <td>Заместитель директора по воспитательной работе</td>
                  <td>Кошкина Вероника Игоревна</td>
                  <td>8 (342) 244-89-21</td>
                  <td>ppk4@mail.ru</td>
                </tr>
                <tr>
                  <td>Руководитель БПОО</td>
                  <td>Челнокова Ольга Викторовна</td>
                  <td>8 (342) 244-89-21</td>
                  <td>ppk4@mail.ru</td>
                </tr>
                <tr>
                  <td>Руководитель учебно-производственной практикой</td>
                  <td>Авдейкина Ольга Борисовна</td>
                  <td>8 (342) 244-89-21</td>
                  <td>ppk4@mail.ru</td>
                </tr>
                <tr>
                  <td>Начальник хозяйственного отдела</td>
                  <td>Давыдова Ирина Владимировна</td>
                  <td>8 (342) 244-89-21</td>
                  <td>ppk4@mail.ru</td>
                </tr>
                <tr>
                  <td>Заведующий отделом библиотеки</td>
                  <td>Кузнецова Светлана Алексеевна</td>
                  <td>8 (342) 244-89-21</td>
                  <td>ppk4@mail.ru</td>
                </tr>
              </tbody>
            </table>
          </div>
        );
        buttons = <BackToMenuButton />;
      }
      
      const newMessages: ChatMessage[] = [];
      
      if (answer) {
        newMessages.push({ 
          sender: 'bot', 
          content: (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bot-message-content"
            >
              {answer}
            </motion.div>
          )
        });
      }
      
      if (buttons) {
        newMessages.push({ 
          sender: 'buttons', 
          content: (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {buttons}
            </motion.div>
          )
        });
      }
      
      setMessages(prev => [...prev, ...newMessages]);
      setIsTyping(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('http://localhost:5001/api/requests', {
        ...requestData,
        birthDate: requestData.birthDate || undefined
      });
      
      setShowRequestModal(false);
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev.filter(msg => msg.sender !== 'buttons'),
          {
            sender: 'bot',
            content: (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bot-message-content"
              >
                <div className="bot-message-text">
                  Ваш запрос на справку успешно отправлен! Номер: #{response.data.id || Date.now()}.
                </div>
              </motion.div>
            )
          },
          {
            sender: 'buttons',
            content: showMainMenuButtons()
          }
        ]);
        setIsTyping(false);
      }, 1500);
      
      setRequestData({
        studentName: '',
        phone: '',
        group: '',
        district: '',
        birthDate: '',
        requestType: ''
      });
      
    } catch (error) {
      setMessages(prev => [
        ...prev.filter(msg => msg.sender !== 'buttons'),
        {
          sender: 'bot',
          content: (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bot-message-content"
            >
              <div className="bot-message-text error">
                {axios.isAxiosError(error) 
                  ? error.response?.data?.message || 'Ошибка отправки'
                  : 'Ошибка отправки'}
              </div>
            </motion.div>
          )
        },
        {
          sender: 'buttons',
          content: showMainMenuButtons()
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5001/api/feedback', feedbackData);
      
      setShowFeedbackModal(false);
      setIsTyping(true);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev.filter(msg => msg.sender !== 'buttons'),
          {
            sender: 'bot',
            content: (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bot-message-content"
              >
                <div className="bot-message-text">
                  Ваше сообщение успешно отправлено! Спасибо за обратную связь.
                </div>
              </motion.div>
            )
          },
          {
            sender: 'buttons',
            content: showMainMenuButtons()
          }
        ]);
        setIsTyping(false);
      }, 1500);

      setFeedbackData({ name: '', phone: '', message: '' });

    } catch (error) {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [
          ...prev.filter(msg => msg.sender !== 'buttons'),
          {
            sender: 'bot',
            content: (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bot-message-content"
              >
                <div className="bot-message-text error">
                  Ошибка отправки. Попробуйте позже.
                </div>
              </motion.div>
            )
          },
          {
            sender: 'buttons',
            content: showMainMenuButtons()
          }
        ]);
        setIsTyping(false);
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="chat-app">
      <Header role="student" onLogout={() => {}} />
      
      <div className="chat-container">
        <div className="chat-window">
          <div className="messages-area">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`message-wrapper ${msg.sender}`}
              >
                {msg.content}
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <span>Печатает...</span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <div className="chat-footer">
          <Link to="/faq" className="help-link">
            Нужна помощь? Посмотрите частые вопросы
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showRequestModal && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRequestModal(false)}
          >
            <motion.div 
              className="modal-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Заказ справки</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowRequestModal(false)}
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              </div>
              
              <form className="document-form" onSubmit={handleSubmitRequest}>
                <div className="form-group">
                  <label htmlFor="studentName">ФИО студента:</label>
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={requestData.studentName}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Телефон:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={requestData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="group">Группа:</label>
                  <input
                    type="text"
                    id="group"
                    name="group"
                    value={requestData.group}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="district">Район:</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={requestData.district}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="birthDate">Дата рождения:</label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={requestData.birthDate}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="requestType">Тип справки:</label>
                  <select
                    id="requestType"
                    name="requestType"
                    value={requestData.requestType}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Выберите тип справки</option>
                    <option value="Справка об обучении">Справка об обучении</option>
                    <option value="Справка о стипендии">Справка о стипендии</option>
                    <option value="Справка для военкомата">Справка для военкомата</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button"
                    className="secondary-btn"
                    onClick={() => setShowRequestModal(false)}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit"
                    className="primary-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить запрос'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFeedbackModal && (
          <motion.div 
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFeedbackModal(false)}
          >
            <motion.div 
              className="modal-card"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Обратная связь</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowFeedbackModal(false)}
                  disabled={isSubmitting}
                >
                  &times;
                </button>
              </div>
              
              <form className="document-form" onSubmit={handleSubmitFeedback}>
                <div className="form-group">
                  <label htmlFor="feedbackName">Ваше ФИО:</label>
                  <input
                    type="text"
                    id="feedbackName"
                    name="name"
                    value={feedbackData.name}
                    onChange={handleFeedbackChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="feedbackPhone">Телефон:</label>
                  <input
                    type="tel"
                    id="feedbackPhone"
                    name="phone"
                    value={feedbackData.phone}
                    onChange={handleFeedbackChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="feedbackMessage">Ваше сообщение:</label>
                  <textarea
                    id="feedbackMessage"
                    name="message"
                    value={feedbackData.message}
                    onChange={handleFeedbackChange}
                    required
                    disabled={isSubmitting}
                    rows={5}
                    style={{ resize: 'vertical' }}
                  />
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button"
                    className="secondary-btn"
                    onClick={() => setShowFeedbackModal(false)}
                    disabled={isSubmitting}
                  >
                    Отмена
                  </button>
                  <button 
                    type="submit"
                    className="primary-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить сообщение'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentChatBot;