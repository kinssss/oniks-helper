import React from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import '../styles/Guide.css';

const GuidePage: React.FC = () => {
  const steps = [
    {
      title: "Создание тикета",
      description: "Опишите проблему в чате с ботом",
      icon: "✍️"
    },
    {
      title: "Автоматическое предложение",
      description: "Бот распознает проблему и предложит создать тикет",
      icon: "🤖"
    },
    {
      title: "Уведомления",
      description: "Получайте оповещения об изменении статуса",
      icon: "🔔"
    }
  ];

  return (
    <div className="guide-page">
      <Header role="teacher" onLogout={() => {}} />
      
      <motion.div 
        className="guide-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="guide-header"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h1 className="guide-title">Руководство преподавателя</h1>
          <p className="guide-subtitle">Полное руководство по работе с системой ОниксПомощник</p>
        </motion.div>

        <div className="guide-steps-grid">
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="guide-step-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(74, 108, 247, 0.2)" }}
            >
              <div className="guide-step-icon">{step.icon}</div>
              <div className="guide-step-number">0{index + 1}</div>
              <h3 className="guide-step-title">{step.title}</h3>
              <p className="guide-step-desc">{step.description}</p>
              <motion.div 
                className="guide-step-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="guide-additional-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="guide-info-grid">
            <motion.div 
              className="guide-info-card"
              whileHover={{ scale: 1.02 }}
            >
              <div className="guide-info-content">
                <h4 className="info-section-title">Полное руководство по использованию чат-бота</h4>
                
                <div className="info-section">
                  <h5 className="info-subtitle">Введение</h5>
                  <p className="info-text">
                    Чат-бот "Оникс.Помощник" предназначен для быстрого решения технических проблем преподавателей. 
                    Бот предоставляет пошаговые инструкции для распространенных проблем и помогает создать заявку 
                    в техподдержку при необходимости.
                  </p>
                </div>

                <div className="info-section">
                  <h5 className="info-subtitle">Основные функции</h5>
                  <ul className="info-list">
                    <li>Автоматическое распознавание проблем по ключевым словам</li>
                    <li>Предоставление пошаговых инструкций</li>
                    <li>Создание заявок в техподдержку</li>
                    <li>Визуальные подсказки (изображения)</li>
                  </ul>
                </div>

                <div className="info-section">
                  <h5 className="info-subtitle">Как начать работу</h5>
                  <ol className="info-list ordered">
                    <li>При открытии чата бот автоматически отправляет приветственное сообщение</li>
                    <li>Опишите свою проблему в текстовом поле ввода</li>
                    <li>Нажмите кнопку отправки или Enter</li>
                  </ol>
                </div>

                <div className="info-section">
                  <h5 className="info-subtitle">Возможные сценарии работы</h5>
                  <div className="scenario">
                    <h6 className="scenario-title">1. Получение автоматической инструкции</h6>
                    <p className="info-text">
                      Если бот распознает проблему по ключевым словам, он предложит:
                    </p>
                    <ul className="info-list nested">
                      <li>Пошаговое руководство по решению</li>
                      <li>Дополнительные изображения (при наличии)</li>
                      <li>Две кнопки:
                        <ul className="info-list nested">
                          <li>"Проблема решена" - завершает диалог</li>
                          <li>"Нужна помощь" - открывает форму заявки</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className="scenario">
                    <h6 className="scenario-title">2. Создание заявки в техподдержку</h6>
                    <p className="info-text">
                      Если бот не может предложить решение:
                    </p>
                    <ol className="info-list ordered nested">
                      <li>Бот предложит создать заявку</li>
                      <li>Нажмите "Да" для открытия формы</li>
                      <li>Заполните обязательные поля:
                        <ul className="info-list nested">
                          <li>Ваше имя</li>
                          <li>Описание проблемы</li>
                        </ul>
                      </li>
                      <li>Укажите кабинет (необязательно)</li>
                      <li>Нажмите "Отправить" для создания заявки</li>
                    </ol>
                  </div>

                  <div className="scenario">
                    <h6 className="scenario-title">3. Просмотр изображений</h6>
                    <ul className="info-list">
                      <li>Нажмите на любое изображение в чате для увеличения</li>
                      <li>Чтобы закрыть увеличенное изображение, нажмите на него или на крестик</li>
                    </ul>
                  </div>
                </div>

                <div className="info-section">
                  <h5 className="info-subtitle">Советы по использованию</h5>
                  <ul className="info-list tips">
                    <li>Описывайте проблему максимально конкретно ("не работает проектор в 305 кабинете")</li>
                    <li>Используйте кнопки для быстрого взаимодействия</li>
                    <li>Проверяйте пошаговые инструкции перед созданием заявки</li>
                    <li>Для сложных проблем сразу нажимайте "Нужна помощь"</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GuidePage;