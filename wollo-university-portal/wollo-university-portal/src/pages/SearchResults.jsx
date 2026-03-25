import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LangContext';
import SearchBar from '../components/common/SearchBar';
import PolicyCard from '../components/common/PolicyCard';
import { searchPolicies } from '../services/api';

export default function SearchResults() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    searchPolicies({ q: query })
      .then(r => { setResults(r.data.data); setTotal(r.data.meta.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-page__header">
        <div className="section-container">
          <h1 className="page-title">{t('search.title')}</h1>
          <SearchBar initialValue={query} />
          {query && !loading && (
            <p className="search-page__summary">
              {total} {t('search.results')} for <strong>"{query}"</strong>
            </p>
          )}
        </div>
      </div>

      <div className="section-container search-page__body">
        {loading ? (
          <div className="empty-state"><p>{t('common.loading')}</p></div>
        ) : !query ? (
          <div className="empty-state"><p>Enter a search term above to find policies.</p></div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <p>{t('search.noResults')} "{query}"</p>
            <Link to="/policies" className="btn btn--primary">{t('hero.browseAll')}</Link>
          </div>
        ) : (
          <div className="policies-grid">
            {results.map(p => <PolicyCard key={p.id} policy={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
