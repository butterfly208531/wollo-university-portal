import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LangContext';
import { Filter } from 'lucide-react';
import { getAuditLogs } from '../../services/api';

const actionColors = { CREATE: 'green', UPDATE: 'blue', DELETE: 'red', LOGIN: 'gray', IMPORT: 'orange' };

export default function AuditLogs() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = filter ? { action: filter } : {};
    setLoading(true);
    getAuditLogs(params)
      .then(res => setLogs(res.data.data || res.data))
      .catch(() => setError('Failed to load audit logs.'))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">{t('admin.auditLogs')}</h1>
      </div>

      <div className="admin-toolbar">
        <div className="admin-toolbar__filters">
          <Filter size={16} aria-hidden="true" />
          {['', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'IMPORT'].map(a => (
            <button key={a} className={`filter-chip ${filter === a ? 'filter-chip--active' : ''}`} onClick={() => setFilter(a)}>
              {a || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="admin-loading">Loading...</p>}
      {error && <p className="alert alert--error">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table" aria-label="Audit logs">
            <thead>
              <tr><th>Admin</th><th>Action</th><th>Resource</th><th>Detail</th><th>Timestamp</th></tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>No logs found.</td></tr>
              )}
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{log.admin?.name || log.admin || log.user}</td>
                  <td><span className={`badge badge--${actionColors[log.action] || 'gray'}`}>{log.action}</span></td>
                  <td>{log.resource || log.model_type}</td>
                  <td>{log.detail || log.description}</td>
                  <td>{log.timestamp || (log.created_at ? new Date(log.created_at).toLocaleString() : '-')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
