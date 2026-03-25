import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LangContext';
import { Save } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

export default function SystemSettings() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [settings, setSettings] = useState({
    site_title: 'Wollo University Academic Portal',
    default_language: 'en',
    default_theme: 'light',
    maintenance_mode: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getSettings()
      .then(res => {
        const data = res.data.data || res.data;
        setSettings({
          ...data,
          maintenance_mode: data.maintenance_mode === true || data.maintenance_mode === 'true' || data.maintenance_mode === '1',
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await updateSettings({ ...settings, maintenance_mode: settings.maintenance_mode });
      // Apply theme immediately
      if (settings.default_theme && settings.default_theme !== theme) {
        toggleTheme();
      }
      localStorage.setItem('wu_theme', settings.default_theme);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Loading...</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">{t('admin.systemSettings')}</h1>
      </div>

      {saved && <div className="alert alert--success" role="status">Settings saved successfully.</div>}
      {error && <div className="alert alert--error">{error}</div>}

      <form className="settings-form" onSubmit={handleSave}>
        <div className="settings-section">
          <h2 className="admin-section-title">General</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="siteTitle">Site Title</label>
            <input id="siteTitle" type="text" className="form-input" value={settings.site_title || ''}
              onChange={e => setSettings(s => ({ ...s, site_title: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="defaultLang">Default Language</label>
            <select id="defaultLang" className="form-select" value={settings.default_language || 'en'}
              onChange={e => setSettings(s => ({ ...s, default_language: e.target.value }))}>
              <option value="en">English</option>
              <option value="am">Amharic</option>
              <option value="om">Afaan Oromoo</option>
              <option value="ti">ትግርኛ</option>
              <option value="so">Soomaali</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="defaultTheme">Default Theme</label>
            <select id="defaultTheme" className="form-select" value={settings.default_theme || 'light'}
              onChange={e => setSettings(s => ({ ...s, default_theme: e.target.value }))}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <label className="a11y-widget__toggle">
            <span>Maintenance Mode</span>
            <input type="checkbox" checked={!!settings.maintenance_mode}
              onChange={e => setSettings(s => ({ ...s, maintenance_mode: e.target.checked }))} />
            <span className="a11y-widget__switch" aria-hidden="true"></span>
          </label>
        </div>

        <div className="policy-form__actions">
          <button type="submit" className="btn btn--primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
