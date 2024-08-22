import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Sys from './components/Sys'; // Import Sys component
import Payment from './components/Payment'; // Import Payment component
import './App.css'; // Import file CSS

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sys-info-and-uploud" element={<Sys />} /> {/* Add route for Sys */}
        <Route path="/payment" element={<Payment />} /> {/* Add route for Payment */}
      </Routes>
    </Router>
  );
};

export default App;
