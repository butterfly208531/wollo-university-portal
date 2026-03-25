import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { adminLogin } from '../../services/api';

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login, user, ready } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (ready && user) navigate('/admin/dashboard', { replace: true });
  }, [ready, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminLogin(form.email, form.password);
      login(res.data.user, res.data.token);
      // navigate happens via useEffect above once user state updates
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <img src="https://wu.edu.et/e-stem/assets/images/discover-mobile-350x350-53.png" alt="Wollo University Logo" className="login-card__logo-img" />
          <h1 className="login-card__title">{t('admin.login')}</h1>
          <p className="login-card__subtitle">Wollo University Academic Portal</p>
        </div>

        {error && <div className="alert alert--error" role="alert">{error}</div>}

        <form className="login-card__form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email" className="form-label">{t('admin.email')}</label>
            <div className="form-input-wrap">
              <Mail size={16} className="form-input-icon" aria-hidden="true" />
              <input id="email" type="email" className="form-input form-input--icon" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required autoComplete="email" placeholder="admin@wu.edu.et" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">{t('admin.password')}</label>
            <div className="form-input-wrap">
              <Lock size={16} className="form-input-icon" aria-hidden="true" />
              <input id="password" type={showPw ? 'text' : 'password'} className="form-input form-input--icon"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required autoComplete="current-password" />
              <button type="button" className="form-input-toggle" onClick={() => setShowPw(s => !s)} aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? t('common.loading') : t('admin.signIn')}
          </button>
        </form>

        <div className="login-card__footer">
          <Link to="/" className="login-card__back">← Back to Portal</Link>
        </div>
      </div>
    </div>
  );
}
