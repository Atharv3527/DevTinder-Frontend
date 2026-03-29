import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import HomeLayout from './components/HomeLayout';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import Community from './pages/Community';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Notifications from './pages/Notifications';
import ProfileSetup from './pages/ProfileSetup';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/feed" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Home gets its own full-width layout for the scroll animation */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* All other pages use the standard constrained layout */}
      <Route path="/" element={<Layout />}>
        <Route path="feed" element={<Feed />} />
        <Route path="community" element={<Community />} />
        <Route
          path="chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="jobs" element={<Jobs />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="profile/:uid" element={<Profile />} />
        <Route
          path="profile-setup"
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
