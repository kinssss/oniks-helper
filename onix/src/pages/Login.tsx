import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!login || !password) {
      setError('Введите логин и пароль');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { login, password });
      localStorage.setItem('role', res.data.role);
      window.location.href = `/${res.data.role}-chat-bot`;
    } catch (error) {
      setError('Неверный логин или пароль');
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: string) => {
    localStorage.setItem('role', role);
    window.location.href = `/${role}-chat-bot`;
  };

  return (
    <div className="auth-page">
      <motion.div 
        className="auth-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="auth-card"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="auth-header">
            <h1>Добро пожаловать</h1>
            <p>Войдите в свой аккаунт</p>
          </div>

          <div className="auth-form">
            <motion.div 
              className="auth-input-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <label htmlFor="auth-login-input">Логин</label>
              <input 
                id="auth-login-input"
                type="text" 
                placeholder="Введите ваш логин" 
                value={login} 
                onChange={(e) => setLogin(e.target.value)}
                className={error ? 'auth-input-error' : ''}
              />
            </motion.div>

            <motion.div 
              className="auth-input-group"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <label htmlFor="auth-password-input">Пароль</label>
              <input 
                id="auth-password-input"
                type="password" 
                placeholder="Введите ваш пароль" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'auth-input-error' : ''}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </motion.div>

            {error && (
              <motion.div 
                className="auth-error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              onClick={handleLogin}
              className="auth-submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {isLoading ? (
                <div className="auth-loader"></div>
              ) : (
                'Войти'
              )}
            </motion.button>
          </div>

          <motion.div 
            className="auth-demo-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>Или войдите как:</p>
            <div className="auth-demo-buttons">
              <motion.button
                onClick={() => handleDemoLogin('student')}
                className="auth-demo-btn auth-demo-student"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Студент
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;