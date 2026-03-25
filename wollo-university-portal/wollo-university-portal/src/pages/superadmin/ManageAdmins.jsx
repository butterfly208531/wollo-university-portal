import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LangContext';
import { Plus, Trash2, Shield } from 'lucide-react';
import { getAdmins, createAdmin, deleteAdmin } from '../../services/api';

export default function ManageAdmins() {
  const { t } = useTranslation();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'admin', password: '' });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchAdmins = async () => {
    try {
      const res = await getAdmins();
      setAdmins(res.data.data || res.data);
    } catch {
      setError('Failed to load admins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      await createAdmin(form);
      setForm({ name: '', email: '', role: 'admin', password: '' });
      setShowForm(false);
      fetchAdmins();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create admin.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete admin "${name}"?`)) return;
    try {
      await deleteAdmin(id);
      setAdmins(a => a.filter(x => x.id !== id));
    } catch {
      alert('Failed to delete admin.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">{t('admin.manageAdmins')}</h1>
        <button className="btn btn--primary" onClick={() => setShowForm(s => !s)}><Plus size={16} /> Add Admin</button>
      </div>

      {showForm && (
        <form className="admin-inline-form" onSubmit={handleAdd}>
          <h2 className="admin-section-title">New Admin</h2>
          {formError && <p className="alert alert--error">{formError}</p>}
          <div className="admin-inline-form__grid">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input type="text" className="form-input" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select className="form-select" value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-input" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
          </div>
          <div className="policy-form__actions">
            <button type="button" className="btn btn--outline" onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving}>{saving ? 'Creating...' : 'Create Admin'}</button>
          </div>
        </form>
      )}

      {loading && <p className="admin-loading">Loading...</p>}
      {error && <p className="alert alert--error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Admin users">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {admins.map(a => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.email}</td>
                  <td><span className={`badge ${a.role === 'super_admin' ? 'badge--purple' : 'badge--blue'}`}><Shield size={12} aria-hidden="true" /> {a.role}</span></td>
                  <td><span className={`badge ${a.is_active ? 'badge--green' : 'badge--red'}`}>{a.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>{a.last_login ? new Date(a.last_login).toLocaleDateString() : '-'}</td>
                  <td className="admin-table__actions">
                    <button className="admin-table__action admin-table__action--delete"
                      onClick={() => handleDelete(a.id, a.name)} aria-label={`Delete ${a.name}`}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
