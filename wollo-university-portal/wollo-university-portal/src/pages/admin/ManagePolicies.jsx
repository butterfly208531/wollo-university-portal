import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { Plus, Edit, Trash2, History, Search } from 'lucide-react';
import { getAdminPolicies, deletePolicy } from '../../services/api';

export default function ManagePolicies() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const res = await getAdminPolicies();
      setList(res.data.data || res.data);
    } catch {
      setError('Failed to load policies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPolicies(); }, []);

  const filtered = list.filter(p => {
    const title = typeof p.title === 'object' ? p.title?.en : p.title;
    return title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase());
  });

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await deletePolicy(id);
      setList(l => l.filter(p => p.id !== id));
    } catch {
      alert('Failed to delete policy.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Manage Policies</h1>
        <Link to="/admin/policies/new" className="btn btn--primary"><Plus size={16} /> {t('admin.createPolicy')}</Link>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar__search">
          <Search size={16} aria-hidden="true" />
          <input type="search" placeholder="Search policies..." value={search}
            onChange={e => setSearch(e.target.value)} className="admin-toolbar__input" aria-label="Search policies" />
        </div>
        <span className="admin-toolbar__count">{filtered.length} policies</span>
      </div>

      {loading && <p className="admin-loading">Loading...</p>}
      {error && <p className="alert alert--error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Policies list">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Version</th><th>Updated</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><Link to={`/policies/${p.id}`} className="admin-table__link">{typeof p.title === 'object' ? p.title?.en : p.title}</Link></td>
                  <td><span className="badge">{p.category?.name || p.category}</span></td>
                  <td>v{p.version || 1}</td>
                  <td>{p.updated_at ? new Date(p.updated_at).toLocaleDateString() : '-'}</td>
                  <td className="admin-table__actions">
                    <Link to={`/admin/policies/${p.id}/edit`} className="admin-table__action admin-table__action--edit" aria-label={`Edit ${p.title}`}><Edit size={14} /></Link>
                    <Link to={`/admin/policies/${p.id}/versions`} className="admin-table__action admin-table__action--history" aria-label="Version history"><History size={14} /></Link>
                    <button onClick={() => handleDelete(p.id, p.title)} className="admin-table__action admin-table__action--delete" aria-label={`Delete ${p.title}`}><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No policies found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
