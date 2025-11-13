// src/App.js (Updated)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminQuestionEntry from './pages/AdminQuestionEntry';
import UserQuiz from './pages/UserQuiz';
import TopicSelection from './pages/TopicSelection';
import TopicInfo from './pages/TopicInfo';
import TopicDetail from './pages/TopicDetail';
import CourseDays from './pages/CourseDays';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/topic-selection" element={<TopicSelection />} />
          <Route path="/admin/topic-info" element={<TopicInfo />} />
          <Route path="/admin/add-questions" element={<AdminQuestionEntry />} />
          <Route path="/quiz/:course/:day" element={<UserQuiz />} />
          <Route path="/course-days/:course" element={<CourseDays />} />
          <Route path="/users/:day" element={<UserQuiz />} />
<Route path="/topic-detail/:course/:day" element={<TopicDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;