import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { BookOpen, FolderOpen, Users, Activity, Plus, FileText, Settings, Upload } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAdminPolicies, getCategories, getAnalytics } from '../../services/api';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, isSuperAdmin } = useAuth();
  const [recentPolicies, setRecentPolicies] = useState([]);
  const [policyCount, setPolicyCount] = useState('-');
  const [categoryCount, setCategoryCount] = useState('-');

  useEffect(() => {
    getAdminPolicies({ per_page: 5 }).then(r => {
      setRecentPolicies(r.data.data);
      setPolicyCount(r.data.meta.total);
    }).catch(() => {});
    getCategories().then(r => setCategoryCount(r.data.length)).catch(() => {});
  }, []);

  const stats = [
    { icon: <BookOpen size={24} />, label: t('admin.totalPolicies'), value: policyCount, color: 'blue' },
    { icon: <FolderOpen size={24} />, label: t('admin.totalCategories'), value: categoryCount, color: 'green' },
    { icon: <Activity size={24} />, label: 'Recent Updates', value: recentPolicies.length, color: 'orange' },
    { icon: <Users size={24} />, label: 'Admin Users', value: isSuperAdmin ? '2' : '-', color: 'purple' },
  ];

  const quickActions = [
    { icon: <Plus size={18} />, label: t('admin.createPolicy'), to: '/admin/policies/new', color: 'blue' },
    { icon: <FileText size={18} />, label: 'Manage Policies', to: '/admin/policies', color: 'green' },
    { icon: <Upload size={18} />, label: t('admin.importPolicies'), to: '/admin/import', color: 'teal' },
    ...(isSuperAdmin ? [
      { icon: <Activity size={18} />, label: t('admin.auditLogs'), to: '/admin/audit-logs', color: 'orange' },
      { icon: <Users size={18} />, label: t('admin.manageAdmins'), to: '/super-admin/admins', color: 'purple' },
      { icon: <Settings size={18} />, label: t('admin.systemSettings'), to: '/super-admin/settings', color: 'red' },
    ] : []),
  ];

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">{t('admin.dashboard')}</h1>
        <p className="admin-page__subtitle">Welcome back, {user?.name}</p>
      </div>

      <div className="admin-stats">
        {stats.map((s, i) => (
          <div key={i} className={`admin-stat admin-stat--${s.color}`}>
            <div className="admin-stat__icon" aria-hidden="true">{s.icon}</div>
            <div className="admin-stat__value">{s.value}</div>
            <div className="admin-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-dashboard__body">
        <section className="admin-quick-actions" aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title" className="admin-section-title">Quick Actions</h2>
          <div className="admin-quick-actions__grid">
            {quickActions.map((a, i) => (
              <Link key={i} to={a.to} className={`admin-quick-action admin-quick-action--${a.color}`}>
                <span className="admin-quick-action__icon" aria-hidden="true">{a.icon}</span>
                <span>{a.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-recent" aria-labelledby="recent-title">
          <h2 id="recent-title" className="admin-section-title">{t('admin.recentActivity')}</h2>
          <div className="admin-table-wrap">
            <table className="admin-table" aria-label="Recent policies">
              <thead>
                <tr><th>Title</th><th>Category</th><th>Updated</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {recentPolicies.map(p => (
                  <tr key={p.id}>
                    <td>{typeof p.title === 'object' ? p.title?.en : p.title}</td>
                    <td><span className="badge">{p.category}</span></td>
                    <td>{p.updated_at}</td>
                    <td><Link to={`/admin/policies/${p.id}/edit`} className="admin-table__action">Edit</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
