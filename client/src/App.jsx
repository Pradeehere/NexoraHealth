import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import HealthTracker from './pages/HealthTracker';
import Reports from './pages/Reports';
import BMIPage from './pages/BMIPage';
import Profile from './pages/Profile';
import AirQualityPage from './pages/AirQualityPage';
import MealPlannerPage from './pages/MealPlannerPage';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import PWAInstallBanner from './components/common/PWAInstallBanner';

function AppContent() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('nexora-sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('nexora-sidebar-collapsed', isCollapsed);
  }, [isCollapsed]);

  const publicRoutes = ['/', '/login', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  if (isPublicRoute) {
    return (
      <main className="min-h-screen">
        <Toaster position="top-right" gutter={8} containerStyle={{ zIndex: 60 }} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col md:flex-row">
      <Toaster position="top-right" gutter={8} containerStyle={{ zIndex: 60 }} />

      {/* Sidebar - Fixed on desktop, Bottom Tab on mobile */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-[72px]' : 'md:ml-64'}`}
      >
        <Navbar isCollapsed={isCollapsed} />
        <main className="flex-1 p-4 md:p-8 mt-16 pb-24 md:pb-8 max-w-[100vw] overflow-x-hidden">
          <Routes>
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/tracker" element={
              <ProtectedRoute>
                <HealthTracker />
              </ProtectedRoute>
            } />
            <Route path="/meal-planner" element={
              <ProtectedRoute>
                <MealPlannerPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/bmi" element={
              <ProtectedRoute>
                <BMIPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/air-quality" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AirQualityPage />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <PWAInstallBanner />
      <AppContent />
    </Router>
  );
}

export default App;
