import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LangContext';
import { Calendar, Tag, ChevronRight, Printer } from 'lucide-react';
import { format } from 'date-fns';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { getPolicy, getPolicies } from '../services/api';

export default function PolicyDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [policy, setPolicy] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPolicy(id)
      .then(r => {
        setPolicy(r.data);
        try {
          const recent = JSON.parse(localStorage.getItem('wu_recent_policies') || '[]');
          localStorage.setItem('wu_recent_policies', JSON.stringify([id, ...recent.filter(x => x !== id)].slice(0, 10)));
        } catch {}
        return getPolicies({ category: r.data.category, per_page: 5 });
      })
      .then(r => setRelated((r.data.data || []).filter(p => String(p.id) !== String(id)).slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="section-container empty-state"><p>{t('common.loading')}</p></div>;
  if (!policy) return (
    <div className="section-container empty-state">
      <h1>{t('common.pageNotFound')}</h1>
      <Link to="/policies" className="btn btn--primary">{t('common.back')}</Link>
    </div>
  );

  return (
    <div className="policy-detail">
      <div className="policy-detail__header">
        <div className="section-container">
          <Breadcrumbs items={[
            { label: t('nav.home'), href: '/' },
            { label: t('nav.policies'), href: '/policies' },
            { label: policy.title?.en, href: `/policies/${id}` }
          ]} />
          <div className="policy-detail__meta">
            <span className="policy-card__category">{policy.category}</span>
            <span className="policy-card__version">v{policy.version}</span>
          </div>
          <h1 className="policy-detail__title">{policy.title?.en}</h1>
          <div className="policy-detail__info">
            <span><Calendar size={14} aria-hidden="true" /> {t('policies.lastUpdated')}: {policy.updated_at ? format(new Date(policy.updated_at), 'MMMM d, yyyy') : ''}</span>
            {policy.tags?.length > 0 && <span><Tag size={14} aria-hidden="true" /> {policy.tags.join(', ')}</span>}
          </div>
          <button className="btn btn--outline btn--sm" onClick={() => window.print()} aria-label="Print policy">
            <Printer size={14} /> Print
          </button>
        </div>
      </div>

      <div className="section-container policy-detail__body">
        <article
          className="policy-detail__content prose"
          dangerouslySetInnerHTML={{ __html: policy.content?.en }}
          aria-label={policy.title?.en}
        />
        <aside className="policy-detail__sidebar">
          <div className="policy-detail__sidebar-card">
            <h2 className="policy-detail__sidebar-title">Related Policies</h2>
            {related.map(p => (
              <Link key={p.id} to={`/policies/${p.id}`} className="policy-detail__related-link">
                <ChevronRight size={14} aria-hidden="true" /> {p.title?.en}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
