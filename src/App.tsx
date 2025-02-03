import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Guitar as Hospital, UserRound, Calendar, Menu } from 'lucide-react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Login from './pages/Login';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {session && <Navbar />}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={session ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/patients"
              element={session ? <Patients /> : <Navigate to="/login" />}
            />
            <Route
              path="/appointments"
              element={session ? <Appointments /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!session ? <Login /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;