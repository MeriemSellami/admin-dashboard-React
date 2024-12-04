// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Use Routes instead of Switch
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Import Sidebar
import Tasks from './pages/Tasks';
import Users from './pages/Users';
import PrivateRoute from './components/PrivateRoute';
import DashboardLayout from './components/DashboardLayout';
import Agenda from './pages/Agenda';
import ProjectManagerPage from './pages/ProjectManagerPage'; // Import the Project Manager Page
import './App.css';
import UserLogin from "./pages/UserLogin";
import TeamMemberPage from "./pages/TeamMemberPage";
import CaesarCipher from "./pages/CaesarCipher";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
         {/* User Login */}
         <Route path="/user-login" element={<UserLogin />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Tasks />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Agenda />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/project-manager"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ProjectManagerPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/team-member"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <TeamMemberPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/cesar"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <CaesarCipher />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
