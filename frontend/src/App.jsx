import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Calendar from './pages/Calendar';
import UserManagement from './pages/UserManagement';
import CourseManagement from './pages/CourseManagement';
import Layout from './components/Layout';
import RoleGuard from './components/RoleGuard';
import { ThemeProvider } from './context/ThemeContext';

const AppRoutes = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading app...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Admin only route */}
          <Route path="/analytics" element={
            <RoleGuard allowedRoles={['admin']}>
              <Analytics />
            </RoleGuard>
          } />
          <Route path="/users" element={
            <RoleGuard allowedRoles={['admin']}>
              <UserManagement />
            </RoleGuard>
          } />
          <Route path="/courses" element={
            <RoleGuard allowedRoles={['admin']}>
              <CourseManagement />
            </RoleGuard>
          } />
        </Route>
        
        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
