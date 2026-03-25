import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../contexts/LangContext';
import { Filter, X } from 'lucide-react';
import PolicyCard from '../components/common/PolicyCard';
import Breadcrumbs from '../components/common/Breadcrumbs';
import { getPolicies, getCategories } from '../services/api';

export default function Policies() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [policies, setPolicies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getPolicies({ category: selectedCategory || undefined, sort: sortBy, per_page: 50 })
      .then(r => { setPolicies(r.data.data); setTotal(r.data.meta.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, sortBy]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    setSearchParams(p);
  };

  return (
    <div className="policies-page">
      <div className="policies-page__header">
        <div className="section-container">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.policies'), href: '/policies' }]} />
          <h1 className="page-title">{t('policies.title')}</h1>
          <p className="page-subtitle">{total} policies available</p>
        </div>
      </div>

      <div className="section-container policies-page__body">
        <button className="policies-page__filter-toggle" onClick={() => setSidebarOpen(o => !o)} aria-expanded={sidebarOpen}>
          <Filter size={16} /> {t('policies.filter')}
        </button>

        <aside className={`filter-sidebar ${sidebarOpen ? 'filter-sidebar--open' : ''}`} aria-label="Filter policies">
          <div className="filter-sidebar__header">
            <h2 className="filter-sidebar__title">{t('policies.filter')}</h2>
            <button onClick={() => setSidebarOpen(false)} className="filter-sidebar__close" aria-label={t('common.close')}><X size={16} /></button>
          </div>

          <div className="filter-sidebar__group">
            <h3 className="filter-sidebar__label">{t('policies.category')}</h3>
            <button className={`filter-sidebar__option ${!selectedCategory ? 'filter-sidebar__option--active' : ''}`} onClick={() => setParam('category', '')}>
              {t('categories.all')} ({total})
            </button>
            {categories.map(cat => (
              <button key={cat.id} className={`filter-sidebar__option ${selectedCategory === cat.slug ? 'filter-sidebar__option--active' : ''}`} onClick={() => setParam('category', cat.slug)}>
                {cat.name.en} ({cat.count})
              </button>
            ))}
          </div>

          <div className="filter-sidebar__group">
            <h3 className="filter-sidebar__label">{t('policies.sortBy')}</h3>
            {[['newest', t('policies.newest')], ['oldest', t('policies.oldest')], ['az', t('policies.az')], ['za', t('policies.za')]].map(([val, label]) => (
              <button key={val} className={`filter-sidebar__option ${sortBy === val ? 'filter-sidebar__option--active' : ''}`} onClick={() => setParam('sort', val)}>
                {label}
              </button>
            ))}
          </div>

          {selectedCategory && (
            <button className="filter-sidebar__clear" onClick={() => { setParam('category', ''); setParam('sort', ''); }}>
              {t('search.clearFilters')}
            </button>
          )}
        </aside>

        <div className="policies-page__content">
          {loading ? (
            <div className="empty-state"><p>{t('common.loading')}</p></div>
          ) : policies.length === 0 ? (
            <div className="empty-state"><p>{t('policies.noResults')}</p></div>
          ) : (
            <div className="policies-grid">
              {policies.map(p => <PolicyCard key={p.id} policy={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
