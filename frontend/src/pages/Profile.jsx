import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { FiSave, FiUser } from 'react-icons/fi';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const data = { name };
      if (password) {
        data.password = password;
      }

      await userApi.updateProfile(data);
      await refreshUser();
      
      setMessage('Profile updated successfully!');
      setPassword(''); // Clear password field
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Profile</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Manage your personal account settings.</p>
      </div>

      <div className="glass" style={{ maxWidth: '600px', padding: '2rem' }}>
        
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <FiUser style={{ position: 'absolute', left: '1rem', color: 'var(--color-text-muted)' }} />
              <input 
                type="text" 
                className="form-input" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                style={{ width: '100%', paddingLeft: '2.5rem' }} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={user?.email || ''} 
              disabled 
              style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }} 
            />
            <small style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Email cannot be changed.</small>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <div>
              <span className={`badge badge-${user?.role.toLowerCase()}`}>{user?.role}</span>
            </div>
            <small style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>Roles can only be changed by an Administrator.</small>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '2rem 0' }}></div>

          <div className="form-group">
            <label className="form-label">New Password (Optional)</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Leave blank to keep current password"
              style={{ width: '100%' }} 
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
            {loading ? <div className="loader"></div> : <><FiSave /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
