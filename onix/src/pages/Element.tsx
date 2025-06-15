import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/style.css';
import logo from '../assets/logo.png';

const OnyxAssistant: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/home');
  };

  return (
    <div className="onyx-container">
      <div className="onyx-content">
        <img src={logo} alt="Логотип Оникс" className="onyx-logo" />
        <h1 className="onyx-title">Оникс.Помощник</h1>
        <p className="onyx-subtitle">Интеллектуальный помощник для студентов и преподавателей</p>
      </div>

      <div className="onyx-button-container">
        <button className="onyx-button" onClick={handleNavigate}>Перейти</button>
      </div>

      <footer className="onyx-footer">
        <div className="footer-content">
          <p><strong>Разработчик:</strong> студент группы 1-ИС Гасымов Раул Рауф оглы</p>
          <p><strong>Специальность:</strong> 09.02.07 "Информационные системы и программирование"</p>
          <p>ГБПОУ ПКК "Оникс"</p>
          <p className="footer-year">Пермь 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default OnyxAssistant;