import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import DashboardWithMap from './components/DashboardWithMap';
import IssueSubmission from './components/IssueSubmission';
import IssueDetail from './components/IssueDetail';
import LocationRequest from './components/LocationRequest';
import Navbar from './components/Navbar';

// Protected Route Component with location check
const ProtectedRoute = ({ children, requireLocation = false }) => {
  const { isAuthenticated, userLocation } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If location is required but not available, redirect to location request
  if (requireLocation && (!userLocation.latitude || !userLocation.longitude)) {
    return <Navigate to="/location-request" />;
  }
  
  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userLocation } = useAuth();
  
  if (!isAuthenticated) {
    return children;
  }
  
  // If authenticated but no location, go to location request
  if (!userLocation.latitude || !userLocation.longitude) {
    return <Navigate to="/location-request" />;
  }
  
  return <Navigate to="/dashboard" />;
};

// Location Route Component (only accessible if authenticated but no location)
const LocationRoute = ({ children }) => {
  const { isAuthenticated, userLocation } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If already have location, go to dashboard
  if (userLocation.latitude && userLocation.longitude) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
            <Routes>
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/signup" element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } />
              <Route path="/location-request" element={
                <LocationRoute>
                  <LocationRequest />
                </LocationRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute requireLocation={false}>
                  <Navbar />
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/map" element={
                <ProtectedRoute requireLocation={false}>
                  <Navbar />
                  <DashboardWithMap />
                </ProtectedRoute>
              } />
              <Route path="/submit-issue" element={
                <ProtectedRoute requireLocation={true}>
                  <Navbar />
                  <IssueSubmission />
                </ProtectedRoute>
              } />
              <Route path="/issue/:id" element={
                <ProtectedRoute requireLocation={false}>
                  <Navbar />
                  <IssueDetail />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
