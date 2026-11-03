import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Clubs from './pages/Clubs';
import Bookings from './pages/Bookings';
import AdminBookings from './pages/AdminBookings';
import AdminClubs from './pages/AdminClubs';
import ClubDetail from './pages/ClubDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import SuperAdmin from './pages/SuperAdmin';
import Leaderboard from './pages/Leaderboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
};



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          } />
          <Route path="/admin/bookings" element={
            <ProtectedRoute>
              <AdminBookings />
            </ProtectedRoute>
          } />
          <Route path="/admin/clubs" element={
            <ProtectedRoute>
              <AdminClubs />
            </ProtectedRoute>
          } />
          <Route path="/admin/super" element={
            <ProtectedRoute>
              <SuperAdmin />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;





