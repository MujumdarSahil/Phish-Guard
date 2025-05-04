import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ModelProvider } from './contexts/ModelContext';

// Layout components
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Main app pages
import Dashboard from './pages/Dashboard';
import ScanUrl from './pages/ScanUrl';
import ScanHistory from './pages/ScanHistory';
import UserProfile from './pages/UserProfile';
import EducationResources from './pages/EducationResources';
import NotFound from './pages/NotFound';

// Protected route wrapper
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ModelProvider>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#1F2937',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
            }}
          />
          <Routes>
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scan" element={<ScanUrl />} />
                <Route path="/history" element={<ScanHistory />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/education" element={<EducationResources />} />
              </Route>
            </Route>
            
            {/* Redirect root to dashboard if logged in, otherwise to login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ModelProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;