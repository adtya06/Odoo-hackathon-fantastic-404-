import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import IssueSubmission from './components/IssueSubmission';
import IssueDetail from './components/IssueDetail';
import LocationRequest from './components/LocationRequest';
import Navbar from './components/Navbar';

// Regular User Route Component (excludes admin users)
const UserRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (user?.isAdmin) return <Navigate to="/admin" />;
  return children;
};

// Admin Route Component (only for admin users)
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.isAdmin) return <Navigate to="/dashboard" />;
  return children;
};

// Public Route Component (redirect to appropriate dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    return user?.isAdmin ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />;
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
              <Route path="/dashboard" element={
                <UserRoute>
                  <Navbar />
                  <Dashboard />
                </UserRoute>
              } />
              <Route path="/submit-issue" element={
                <UserRoute>
                  <Navbar />
                  <IssueSubmission />
                </UserRoute>
              } />
              <Route path="/issue/:id" element={
                <UserRoute>
                  <Navbar />
                  <IssueDetail />
                </UserRoute>
              } />
              <Route path="/location-request" element={
                <UserRoute>
                  <LocationRequest />
                </UserRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <Navbar />
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/" element={
                <PublicRoute>
                  <Navigate to="/login" />
                </PublicRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
}

export default App;
