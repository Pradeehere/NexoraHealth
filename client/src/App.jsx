import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col md:flex-row">
        <Toaster position="top-right" gutter={8} containerStyle={{ zIndex: 50 }} />

        {/* Sidebar - Fixed on desktop, Bottom Tab on mobile */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col transition-all duration-300 md:ml-64">
          <Navbar />
          <main className="flex-1 p-4 md:p-8 mt-16 pb-24 md:pb-8 max-w-[100vw] overflow-x-hidden">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
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
                  <AirQualityPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } />
              <Route path="*" element={
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-4xl text-[var(--accent-cyan)] font-heading">Coming Soon</h1>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
