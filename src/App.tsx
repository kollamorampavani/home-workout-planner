import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useStore } from './store/useStore';

// Lazy load pages for better performance
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import WorkoutPlayer from './pages/WorkoutPlayer';
import Tracker from './pages/Tracker';
import Meals from './pages/Meals';
import Community from './pages/Community';
import Recovery from './pages/Recovery';
import Schedule from './pages/Schedule';
import MainLayout from './layouts/MainLayout';

function App() {
  const user = useStore((state) => state.user);

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid rgba(255,255,255,0.1)'
        }
      }} />
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        <Route element={user ? <MainLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={user?.onboarded ? <Dashboard /> : <Navigate to="/onboarding" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workout/:id" element={<WorkoutPlayer />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/community" element={<Community />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/schedule" element={<Schedule />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
