import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const UserManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination and Filtering State
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [total, setTotal] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [editingUser, setEditingUser] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User',
    status: 'active'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      if (statusFilter) params.status = statusFilter;

      const res = await userApi.getAllUsers(params);
      setUsers(res.data.data);
      setTotal(res.data.total);
      setPaginationInfo(res.data.pagination);
    } catch (err) {
      setError('Failed to fetch users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, roleFilter, statusFilter]);

  // Debounced Search trigger
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if(page === 1) {
        fetchUsers();
      } else {
        setPage(1); // changing page will trigger fetchUsers
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line
  }, [search]);

  const openModal = (mode, tUser = null) => {
    setModalMode(mode);
    setEditingUser(tUser);
    if ((mode === 'edit' || mode === 'view') && tUser) {
      setFormData({
        name: tUser.name,
        email: tUser.email,
        password: '',
        role: tUser.role,
        status: tUser.status
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'User',
        status: 'active'
      });
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (modalMode === 'create') {
        await userApi.createUser(formData);
      } else if (modalMode === 'edit') {
        await userApi.updateUser(editingUser._id, formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await userApi.deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError(err.response?.data?.message || 'Delete failed');
      }
    }
  };

  const handleNextPage = () => { if (paginationInfo.next) setPage(paginationInfo.next.page); };
  const handlePrevPage = () => { if (paginationInfo.prev) setPage(paginationInfo.prev.page); };

  return (
    <div className="container main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>User Management</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Manage system accounts and access roles.</p>
        </div>
        
        {user.role === 'Admin' && (
          <button className="btn btn-primary" onClick={() => openModal('create')}>
            <FiPlus /> New User
          </button>
        )}
      </div>

      {/* Toolbar: Search and Filters */}
      <div className="glass" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.5rem', marginBottom: 0 }} 
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FiFilter style={{ color: 'var(--color-text-muted)' }} />
            <select className="form-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} style={{ padding: '0.5rem 1rem', marginBottom: 0 }}>
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="User">User</option>
            </select>
          </div>
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '0.5rem 1rem', marginBottom: 0 }}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="glass" style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
        {loading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <div className="loader" style={{ width: '40px', height: '40px' }}></div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.05)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Email</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Role</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)' }}>{u.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}><span className={`badge badge-${u.role.toLowerCase()}`}>{u.role}</span></td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`badge badge-${u.status === 'active' ? 'active' : 'inactive'}`}>{u.status}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn btn-outline" onClick={() => openModal('view', u)} style={{ padding: '0.4rem 0.6rem' }} title="View Details">
                        <FiEye />
                      </button>

                      {!(user.role === 'Manager' && u.role === 'Admin') && (
                        <button className="btn btn-outline" onClick={() => openModal('edit', u)} style={{ padding: '0.4rem 0.6rem' }} title="Edit">
                          <FiEdit2 />
                        </button>
                      )}
                      
                      {user.role === 'Admin' && u._id !== user._id && (
                        <button className="btn btn-danger" onClick={() => handleDelete(u._id)} style={{ padding: '0.4rem 0.6rem' }} title="Deactivate">
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No users found matching filters</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
          Showing page {page} out of {Math.ceil(total / limit) || 1} 
          <span style={{ margin: '0 0.5rem' }}>•</span> 
          {total} total user(s)
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className="btn btn-outline" 
            disabled={!paginationInfo.prev} 
            onClick={handlePrevPage} 
            style={{ padding: '0.5rem 1rem', opacity: !paginationInfo.prev ? 0.5 : 1, cursor: !paginationInfo.prev ? 'not-allowed' : 'pointer' }}
          >
            <FiChevronLeft /> Previous
          </button>
          <button 
            className="btn btn-outline" 
            disabled={!paginationInfo.next} 
            onClick={handleNextPage} 
            style={{ padding: '0.5rem 1rem', opacity: !paginationInfo.next ? 0.5 : 1, cursor: !paginationInfo.next ? 'not-allowed' : 'pointer' }}
          >
            Next <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Form / Detail Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '1rem', overflowY: 'auto' }}>
          <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.5rem' }}
            >
              <FiX />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>
              {modalMode === 'create' ? 'Create New User' : modalMode === 'edit' ? 'Edit User' : 'User Details'}
            </h2>
            
            {modalMode === 'view' && editingUser ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label className="form-label">Full Name</label>
                  <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>{editingUser.name}</div>
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>{editingUser.email}</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Role</label>
                    <div style={{ padding: '0.75rem 0' }}><span className={`badge badge-${editingUser.role.toLowerCase()}`}>{editingUser.role}</span></div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Status</label>
                    <div style={{ padding: '0.75rem 0' }}><span className={`badge badge-${editingUser.status === 'active' ? 'active' : 'inactive'}`}>{editingUser.status}</span></div>
                  </div>
                </div>
                {/* Audit Context */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                    <strong>Created At:</strong> {new Date(editingUser.createdAt).toLocaleString()}
                  </p>
                  {editingUser.createdBy?.name && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                      <strong>Created By:</strong> {editingUser.createdBy.name}
                    </p>
                  )}
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    <strong>Last Updated:</strong> {new Date(editingUser.updatedAt).toLocaleString()}
                  </p>
                  {editingUser.updatedBy?.name && (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      <strong>Updated By:</strong> {editingUser.updatedBy.name}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" required disabled={modalMode === 'edit'} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Role</label>
                    <select 
                      className="form-select" 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      disabled={user.role === 'Manager'} // Managers can't assign roles
                    >
                      <option value="User">User</option>
                      <option value="Manager">Manager</option>
                      {user.role === 'Admin' && <option value="Admin">Admin</option>}
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Status</label>
                    <select className="form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{modalMode === 'create' ? 'Password (Optional)' : 'New Password (Optional)'}</label>
                  <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Auto-generated if left blank" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                  <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">{modalMode === 'create' ? 'Create User' : 'Save Changes'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
