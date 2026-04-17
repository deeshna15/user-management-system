import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiShield, FiUser, FiActivity, FiKey } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Welcome, {user.name}</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Here is an overview of your account.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        <div className="glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '1rem', borderRadius: '12px', color: '#818cf8' }}>
            <FiUser size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Status</p>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Active</h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '1rem', borderRadius: '12px', color: '#f472b6' }}>
            <FiShield size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Access Level</p>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>{user.role}</h3>
          </div>
        </div>

        <div className="glass" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', color: '#6ee7b7' }}>
             <FiActivity size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Activity</p>
            <h3 style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>Online</h3>
          </div>
        </div>

      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <FiKey /> Security Information
        </h2>
        <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
            You are logged in securely using JSON Web Token authentication. 
            Your role is currently set to <strong>{user.role}</strong>, meaning you have 
            {user.role === 'Admin' ? ' full unrestricted access to user management features.' : user.role === 'Manager' ? ' limited access to view and edit standard users in the system.' : ' standard access restricted to your own profile.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
