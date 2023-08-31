import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import ForgotPage from './components/ForgotPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/forgotPassword" element={<ForgotPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
