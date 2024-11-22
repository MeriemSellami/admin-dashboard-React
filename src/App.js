// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import Sidebar from './components/Sidebar'; // Import Sidebar
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar /> {/* Sidebar in the layout */}
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} /> {/* Use element prop for route */}
            <Route path="/tasks" element={<Tasks />} /> {/* Use element prop for route */}
            <Route path="/users" element={<Users />} /> {/* Use element prop for route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
