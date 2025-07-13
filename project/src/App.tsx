import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import RegisterOrganization from './components/auth/RegisterOrganization';
import RegisterUser from './components/auth/RegisterUser';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import KanbanBoard from './components/kanban/KanbanBoard';
import ProjectChat from './components/chat/ProjectChat';
import ProfilePage from './components/profile/ProfilePage';
import SettingsPage from './components/settings/SettingsPage';
import About from './components/About/AboutUs';
const AppContent: React.FC = () => {
  const { state, dispatch } = useApp();
  const { user, theme } = state;

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

 

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Router>
        {user && <Navbar />}
        <Routes>
          <Route path="/" element={user ? <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} /> : <LandingPage />} />
          <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} /> : <LoginPage />} />
          <Route path="/register-organization" element={user ? <Navigate to="/admin-dashboard" /> : <RegisterOrganization />} />
          <Route path="/register-user" element={user ? <Navigate to="/user-dashboard" /> : <RegisterUser />} />
          <Route path="/about-us" element={ < About />} />

          
          {/* Protected Routes */}
          <Route path="/admin-dashboard" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/user-dashboard" element={user?.role === 'user' ? <UserDashboard /> : <Navigate to="/" />} />
          <Route path="/kanban" element={user ? <KanbanBoard /> : <Navigate to="/" />} />
          <Route path="/chat" element={user ? <ProjectChat /> : <Navigate to="/" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/" />} />
          <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/" />} />
          <Route path="/projects" element={user ? <Navigate to="/kanban" /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;