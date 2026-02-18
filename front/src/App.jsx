import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Event from './pages/Event';
import User from './pages/User';
import Booking from './pages/Booking';
import CreateEvent from './pages/CreateEvent';
import MainLayout from './components/MainLayout';
import { ToastProvider } from './components/ui';
import './index.css';
import { AuthProvider } from './context/authContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes with MainLayout */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/event" element={<Event />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/user" element={<User />} />
              <Route path="/booking" element={<Booking />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
