import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiHome, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active-link' : '';

  if (!user) return null;

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h2 style={{ color: 'var(--color-primary)', margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
          SkyNet
        </h2>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} style={{ textDecoration: 'none', color: isActive('/dashboard') ? 'white' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, transition: 'color 0.2s' }}>
            <FiHome /> Dashboard
          </Link>
          
          {(user.role === 'Admin' || user.role === 'Manager') && (
            <Link to="/users" className={`nav-link ${isActive('/users')}`} style={{ textDecoration: 'none', color: isActive('/users') ? 'white' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, transition: 'color 0.2s' }}>
              <FiUsers /> Manage Users
            </Link>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/profile" style={{ textDecoration: 'none', color: isActive('/profile') ? 'white' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500, transition: 'color 0.2s' }}>
          <FiUser /> {user.name} <span className={`badge badge-${user.role.toLowerCase()}`} style={{ marginLeft: '0.5rem', padding: '0.15rem 0.6rem' }}>{user.role}</span>
        </Link>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
          <FiLogOut /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
