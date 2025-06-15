import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import TeacherChatBot from './pages/TeacherChatBot';
import StudentChatBot from './pages/StudentChatBot';
import AdminPanel from './pages/AdminPanel';
import GuidePage from './pages/Guide';
import FaqPage from './pages/FaqPage';
import Element from './pages/Element';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Element />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher-chat-bot" element={<TeacherChatBot />} />
        <Route path="/student-chat-bot" element={<StudentChatBot />} />
        <Route path="/admin-chat-bot" element={<AdminPanel />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Routes>
    </Router>
  );
};

export default App;