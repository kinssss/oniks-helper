import React, { useState } from 'react';
import Header from '../components/Header';
import { motion } from 'framer-motion';
import '../styles/FaqPage.css';

const FaqPage: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    if (expandedItems.includes(index)) {
      setExpandedItems(expandedItems.filter(item => item !== index));
    } else {
      setExpandedItems([...expandedItems, index]);
    }
  };

  const faqData = [
    {
      question: "Как получить справку?",
      answer: "Вы можете заказать справку через нашего чат-бота или лично в учебной части. В чат-боте просто выберите тип нужной справки и заполните форму.",
      details: [
        "Доступные типы справок: об обучении, о задолженностях, для военкомата"
      ]
    },
    {
      question: "Где забрать готовую справку?",
      answer: "Готовые справки выдаются в учебной части (третий этаж).",
      details: [
        "Часы работы: пн-пт с 9:00 до 17:00",
      ]
    },
    {
      question: "Сколько времени занимает подготовка справки?",
      answer: "Бумажные справки делаются в течение 1-2 рабочих дней",
      details: [
      ]
    },
  ];

  return (
    <div className="faq-page">
      <Header role="student" onLogout={() => {}} />
      
      <div className="faq-container">
        <motion.div 
          className="faq-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="faq-main-title">Часто задаваемые вопросы</h1>
          <p className="faq-subtitle">Здесь вы найдёте ответы на самые популярные вопросы студентов</p>
        </motion.div>

        <div className="faq-items-grid">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              className={`faq-item-card ${expandedItems.includes(index) ? 'faq-item-expanded' : ''}`}
              onClick={() => toggleItem(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ y: -3 }}
            >
              <div className="faq-question-wrapper">
                <h3 className="faq-question-text">{item.question}</h3>
                <span className="faq-toggle-icon">
                  {expandedItems.includes(index) ? '−' : '+'}
                </span>
              </div>
              
              <div className="faq-answer-content">
                <p className="faq-answer-text">{item.answer}</p>
                {expandedItems.includes(index) && (
                  <ul className="faq-details-list">
                    {item.details.map((detail, i) => (
                      <li key={i} className="faq-detail-item">{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;