import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/TeacherChatBot.css';
import Header from '../components/Header';

interface ChatMessage {
  sender: 'user' | 'bot' | 'system';
  text: string;
  id: string;
  buttons?: { text: string; action: () => void }[];
  imageUrl?: string;
}

interface TicketData {
  teacherName: string;
  cabinet: string;
  problem: string;
  status?: string;
}

interface GuideStep {
  text: string;
  imageUrl?: string;
}

interface KeywordGroup {
  name: string;
  keywords: string[];
  guide: {
    steps: GuideStep[];
    followUp: string;
  };
}

interface ChatContent {
  initialMessage: string;
  keywordGroups: KeywordGroup[];
  responses: {
    problemSolved: string;
    needHelp: string;
    ticketCreated: string;
    ticketError: string;
    cancelHelp: string;
  };
  ticketForm: {
    title: string;
    fields: {
      name: { label: string; placeholder: string };
      cabinet: { label: string; placeholder: string };
      problem: { label: string; placeholder: string };
    };
    buttons: {
      submit: string;
      cancel: string;
    };
  };
  buttons: {
    yes: string;
    no: string;
    problemSolved: string;
    needHelp: string;
  };
}

const TeacherChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState<TicketData>({ 
    teacherName: '',
    cabinet: '', 
    problem: '',
    status: 'new'
  });
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [content, setContent] = useState<ChatContent | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [currentGuide, setCurrentGuide] = useState<KeywordGroup | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/content');
        setContent(response.data);
        
        setMessages([
          { 
            sender: 'bot', 
            text: response.data.initialMessage,
            id: '1'
          }
        ]);
      } catch (error) {
        console.error('Error loading chat content:', error);
        
        setMessages([
          { 
            sender: 'bot', 
            text: 'Здравствуйте! Я виртуальный помощник для преподавателей. Напишите о вашей проблеме, и я постараюсь помочь!',
            id: '1'
          }
        ]);
      }
    };

    fetchContent();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || !content) return;

    const newMessage: ChatMessage = { 
      sender: 'user', 
      text: input,
      id: Date.now().toString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      handleBotResponse(input);
      setIsTyping(false);
    }, 1500);
  };

const sendGuideStep = (stepIndex: number) => {
  if (!currentGuide || !content) {
    setIsTyping(false);
    return;
  }

  const step = currentGuide.guide.steps[stepIndex];
  const isLastStep = stepIndex === currentGuide.guide.steps.length - 1;
  
  const stepMessage: ChatMessage = {
    sender: 'bot',
    text: step.text,
    id: `${Date.now()}-step-${stepIndex}`,
    imageUrl: step.imageUrl
  };
  
  setMessages(prev => [...prev, stepMessage]);
  
  const sendFollowUp = () => {
    const followUpMessage: ChatMessage = {
      sender: 'bot',
      text: isLastStep 
        ? 'Если это не помогло решить вашу проблему, вы можете создать запрос в техподдержку.'
        : currentGuide.guide.followUp,
      id: `${Date.now()}-followup`,
      buttons: isLastStep
        ? [
            { 
              text: content.buttons.needHelp, 
              action: () => setShowTicketForm(true)
            },
            { 
              text: content.buttons.problemSolved, 
              action: () => {
                setMessages(prev => [...prev, {
                  sender: 'bot',
                  text: content.responses.problemSolved,
                  id: Date.now().toString()
                }]);
              }
            }
          ]
        : [
            { 
              text: content.buttons.problemSolved, 
              action: () => {
                setMessages(prev => [...prev, {
                  sender: 'bot',
                  text: content.responses.problemSolved,
                  id: Date.now().toString()
                }]);
                setCurrentStepIndex(-1);
                setCurrentGuide(null);
              }
            },
            { 
              text: 'Следующий шаг', 
              action: () => {
                setCurrentStepIndex(stepIndex + 1);
              }
            }
          ]
    };
    
    setMessages(prev => [...prev, followUpMessage]);
    setTimeout(() => setIsTyping(false), 500);
    
    if (isLastStep) {
      setCurrentStepIndex(-1);
      setCurrentGuide(null);
    }
  };

  // Задержка перед отправкой follow-up сообщения
  setTimeout(sendFollowUp, 1500);
};

  const handleBotResponse = (userInput: string) => {
    if (!content) return;
    
    const lowerInput = userInput.toLowerCase();
    setTicketData(prev => ({ ...prev, problem: userInput }));
    
    const matchedGroup = content.keywordGroups.find(group =>
      group.keywords.some(keyword => lowerInput.includes(keyword.toLowerCase()))
    );

    if (matchedGroup) {
      setCurrentGuide(matchedGroup);
      setCurrentStepIndex(0);
    } else {
      const botReply: ChatMessage = {
        sender: 'bot',
        text: content.responses.needHelp,
        id: Date.now().toString(),
        buttons: [
          { 
            text: content.buttons.yes, 
            action: () => setShowTicketForm(true)
          },
          { 
            text: content.buttons.no, 
            action: () => {
              setMessages(prev => [...prev, {
                sender: 'bot',
                text: content.responses.cancelHelp,
                id: Date.now().toString()
              }]);
            }
          }
        ]
      };
      
      setMessages(prev => [...prev, botReply]);
    }
  };

  useEffect(() => {
    if (currentStepIndex >= 0 && currentGuide) {
      setIsTyping(true);
      setTimeout(() => {
        sendGuideStep(currentStepIndex);
      }, 1500);
    }
  }, [currentStepIndex]);

  const submitTicketForm = async () => {
    if (!ticketData.problem.trim() || !ticketData.teacherName.trim() || !content) return;
    
    setIsTyping(true);
    setShowTicketForm(false);
    
    try {
      const response = await axios.post('http://localhost:5001/api/tickets', ticketData);
      
      setMessages(prev => [
        ...prev,
        {
          sender: 'system',
          text: content.responses.ticketCreated.replace('{id}', response.data.id),
          id: Date.now().toString()
        }
      ]);
      
      setTicketData({ teacherName: '', cabinet: '', problem: '', status: 'new' });
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'system',
        text: content.responses.ticketError,
        id: Date.now().toString()
      }]);
    }
    
    setIsTyping(false);
  };

  if (!content) return <div className="tcb-loading">Загрузка...</div>;

  return (
    <div className="tcb-root">
      <Header role="teacher" onLogout={() => {}} />
      
      <div className="tcb-main-container">
        <div className="tcb-messages-container">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`tcb-message tcb-message-${msg.sender}`}
            >
              <div className="tcb-message-content">
                {msg.text.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
                
                {msg.imageUrl && (
                  <div className="tcb-image-container">
                    <img 
                      src={msg.imageUrl} 
                      alt="Инструкция" 
                      className="tcb-image"
                      onClick={() => msg.imageUrl && setSelectedImage(msg.imageUrl)}
                    />
                  </div>
                )}
              </div>
              
              {msg.buttons && (
                <div className={`tcb-message-buttons-container tcb-${msg.sender}-message`}>
                  {msg.buttons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={btn.action}
                      className={`tcb-message-button ${idx === 0 ? 'tcb-message-button-primary' : ''}`}
                    >
                      {btn.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="tcb-typing-indicator">
              <div className="tcb-typing-dot"></div>
              <div className="tcb-typing-dot"></div>
              <div className="tcb-typing-dot"></div>
              <span>Печатает...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="tcb-input-area">
          <div className="tcb-input-wrapper">
            <svg className="tcb-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                    stroke="currentColor" 
                    strokeWidth="2"/>
              <path d="M8 12H16" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"/>
              <path d="M12 16V8" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"/>
            </svg>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите сообщение..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="tcb-message-input"
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="tcb-send-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <div className="tcb-modal-overlay" onClick={() => setSelectedImage(null)}>
            <motion.div 
              className="tcb-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="tcb-close-btn"
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </button>
              <img 
                src={selectedImage} 
                alt="Увеличенное изображение" 
                className="tcb-enlarged-image"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTicketForm && (
          <div className="tcb-modal-overlay">
            <motion.div 
              className="tcb-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3>{content.ticketForm.title}</h3>
              
              <div className="tcb-form-group">
                <label className="tcb-form-label">{content.ticketForm.fields.name.label}</label>
                <input 
                  type="text" 
                  className="tcb-form-input"
                  value={ticketData.teacherName}
                  onChange={(e) => setTicketData({...ticketData, teacherName: e.target.value})}
                  placeholder={content.ticketForm.fields.name.placeholder}
                  required
                />
              </div>
              
              <div className="tcb-form-group">
                <label className="tcb-form-label">{content.ticketForm.fields.cabinet.label}</label>
                <input 
                  type="text" 
                  className="tcb-form-input"
                  value={ticketData.cabinet}
                  onChange={(e) => setTicketData({...ticketData, cabinet: e.target.value})}
                  placeholder={content.ticketForm.fields.cabinet.placeholder}
                />
              </div>
              
              <div className="tcb-form-group">
                <label className="tcb-form-label">{content.ticketForm.fields.problem.label}</label>
                <textarea 
                  className="tcb-form-input tcb-form-textarea"
                  value={ticketData.problem}
                  onChange={(e) => setTicketData({...ticketData, problem: e.target.value})}
                  placeholder={content.ticketForm.fields.problem.placeholder}
                  required
                />
              </div>
              
              <div className="tcb-form-actions">
                <button 
                  onClick={() => {
                    setShowTicketForm(false);
                    setTicketData({ teacherName: '', cabinet: '', problem: '', status: 'new' });
                  }}
                  className="tcb-modal-btn tcb-modal-secondary"
                >
                  {content.ticketForm.buttons.cancel}
                </button>
                <button 
                  onClick={submitTicketForm}
                  className="tcb-modal-btn tcb-modal-primary"
                  disabled={!ticketData.problem.trim() || !ticketData.teacherName.trim()}
                >
                  {content.ticketForm.buttons.submit}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeacherChatBot;