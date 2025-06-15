import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Header.css';

interface HeaderProps {
  role: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, onLogout }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('role');
    onLogout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header-root">
      <div className="header-wrapper">
        <motion.div 
          className="header-logo"
          whileHover={{ scale: 1.05 }}
        >
          <span className="header-logo-primary">Оникс.</span>
          <span className="header-logo-secondary">Помощник</span>
          <div className="header-logo-indicator"></div>
        </motion.div>

        <nav className="header-nav-desktop">
          {role === 'teacher' && (
            <>
              <motion.span 
                whileHover={{ scale: 1.05, color: 'var(--header-accent)' }}
                onClick={() => navigate('/teacher-chat-bot')}
              >
                Чат-бот
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, color: 'var(--header-accent)' }}
                onClick={() => navigate('/guide')}
              >
                Руководство
              </motion.span>
            </>
          )}
          {role === 'student' && (
            <>
              <motion.span 
                whileHover={{ scale: 1.05, color: 'var(--header-accent)' }}
                onClick={() => navigate('/student-chat-bot')}
              >
                Чат-бот
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, color: 'var(--header-accent)' }}
                onClick={() => navigate('/faq')}
              >
                FAQ
              </motion.span>
            </>
          )}
          <motion.button 
            onClick={handleLogout} 
            className="header-logout-btn"
            whileHover={{ scale: 1.05, backgroundColor: 'var(--header-logout-hover)' }}
          >
            Выйти
          </motion.button>
        </nav>

        {/* Мобильное меню */}
        <nav className="header-nav-mobile">
          <motion.button 
            className="header-menu-toggle"
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </motion.button>
          
          {mobileMenuOpen && (
            <motion.div 
              className="header-mobile-content"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {role === 'teacher' && (
                <>
                  <motion.span 
                    onClick={() => {
                      navigate('/teacher-chat-bot');
                      setMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Чат-бот
                  </motion.span>
                  <motion.span 
                    onClick={() => {
                      navigate('/guide');
                      setMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Руководство
                  </motion.span>
                </>
              )}
              {role === 'student' && (
                <>
                  <motion.span 
                    onClick={() => {
                      navigate('/student-chat-bot');
                      setMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Чат-бот
                  </motion.span>
                  <motion.span 
                    onClick={() => {
                      navigate('/faq');
                      setMobileMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    FAQ
                  </motion.span>
                </>
              )}
              <motion.span 
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                whileTap={{ scale: 0.95 }}
                className="header-mobile-logout"
              >
                Выйти
              </motion.span>
            </motion.div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;