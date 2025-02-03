import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Guitar as Hospital, UserRound, Calendar, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Hospital className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">MedCare</span>
          </Link>
          
          <div className="flex space-x-4">
            <NavLink to="/" icon={<Hospital />} label="Dashboard" active={location.pathname === '/'} />
            <NavLink to="/patients" icon={<UserRound />} label="Patients" active={location.pathname === '/patients'} />
            <NavLink to="/appointments" icon={<Calendar />} label="Appointments" active={location.pathname === '/appointments'} />
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-1 px-3 py-2 rounded transition-colors ${
      active ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Navbar;