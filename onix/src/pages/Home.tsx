import React from 'react';
import { motion } from 'framer-motion';
import '../styles/Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-main">
      {/* Анимированный фон */}
      <div className="home-background">
        <motion.div 
          className="home-bg-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />
        <motion.div 
          className="home-bg-triangle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        />
        <motion.div 
          className="home-bg-square"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </div>

      <div className="home-content">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="home-header"
        >
          <motion.h1 
            className="home-main-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Оникс.<span className="home-accent-text">Помощник</span>
          </motion.h1>
          
          <motion.p
            className="home-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Интеллектуальный помощник для студентов и преподавателей
          </motion.p>
        </motion.div>

        <motion.div
          className="home-features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div 
            className="home-feature-card"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="home-feature-icon">🤖</div>
            <h3 className="home-feature-title">Умный чат-бот</h3>
            <p className="home-feature-desc">Получайте ответы на вопросы 24/7</p>
          </motion.div>
          
          <motion.div 
            className="home-feature-card"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="home-feature-icon">⚡</div>
            <h3 className="home-feature-title">Быстрая помощь</h3>
            <p className="home-feature-desc">Мгновенное решение ваших проблем</p>
          </motion.div>
          
          <motion.div 
            className="home-feature-card"
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="home-feature-icon">📚</div>
            <h3 className="home-feature-title">Заказ справок</h3>
            <p className="home-feature-desc">Онлайн оформление документов</p>
          </motion.div>
        </motion.div>

        <motion.div
          className="home-cta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.a
            href="/login"
            className="home-main-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Начать работу
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;