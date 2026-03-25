import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { Save, X } from 'lucide-react';
import { getPolicy, getCategories, createPolicy, updatePolicy } from '../../services/api';

export default function PolicyForm() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title_en: '', title_am: '',
    content_en: '', content_am: '',
    category_id: '', tags: '', status: 'published',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(res => setCategories(res.data.data || res.data)).catch(() => {});
    if (id) {
      getPolicy(id)
        .then(res => {
          const p = res.data.data || res.data;
          setForm({
            title_en: p.title?.en || p.title || '',
            title_am: p.title?.am || '',
            content_en: p.content?.en || p.content || '',
            content_am: p.content?.am || '',
            category_id: p.category_id || p.category?.id || '',
            tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''),
            status: p.status || 'published',
          });
        })
        .catch(() => setError('Failed to load policy.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      title_en: form.title_en,
      title_am: form.title_am,
      content_en: form.content_en,
      content_am: form.content_am,
      category_id: form.category_id,
      status: form.status,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (id) await updatePolicy(id, payload);
      else await createPolicy(payload);
      navigate('/admin/policies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save policy.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><p className="admin-loading">Loading...</p></div>;
  if (error && id && !form.title_en) return <div className="admin-page"><p className="alert alert--error">{error}</p></div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">{id ? t('admin.editPolicy') : t('admin.createPolicy')}</h1>
      </div>

      {error && <p className="alert alert--error">{error}</p>}

      <form className="policy-form" onSubmit={handleSubmit} noValidate>
        <div className="policy-form__bilingual">
          <div className="policy-form__col">
            <div className="policy-form__lang-label">English</div>
            <div className="form-group">
              <label className="form-label" htmlFor="title_en">Title (EN) *</label>
              <input id="title_en" type="text" className="form-input" value={form.title_en}
                onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="content_en">Content (EN) *</label>
              <textarea id="content_en" className="form-textarea" rows={12} value={form.content_en}
                onChange={e => setForm(f => ({ ...f, content_en: e.target.value }))} required />
            </div>
          </div>
          <div className="policy-form__col">
            <div className="policy-form__lang-label">አማርኛ</div>
            <div className="form-group">
              <label className="form-label" htmlFor="title_am">Title (AM)</label>
              <input id="title_am" type="text" className="form-input" value={form.title_am}
                onChange={e => setForm(f => ({ ...f, title_am: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="content_am">Content (AM)</label>
              <textarea id="content_am" className="form-textarea" rows={12} value={form.content_am}
                onChange={e => setForm(f => ({ ...f, content_am: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="policy-form__meta">
          <div className="form-group">
            <label className="form-label" htmlFor="category">{t('admin.selectCategory')} *</label>
            <select id="category" className="form-select" value={form.category_id}
              onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))} required>
              <option value="">-- Select --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name?.en || c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="status">Status</label>
            <select id="status" className="form-select" value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="tags">{t('admin.tags')}</label>
            <input id="tags" type="text" className="form-input" value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="comma, separated, tags" />
          </div>
        </div>

        <div className="policy-form__actions">
          <button type="button" className="btn btn--outline" onClick={() => navigate('/admin/policies')}>
            <X size={16} /> {t('admin.cancel')}
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : t('admin.save')}
          </button>
        </div>
      </form>
    </div>
  );
}
