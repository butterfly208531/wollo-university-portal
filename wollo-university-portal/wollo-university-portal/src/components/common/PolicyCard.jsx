import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { BookOpen, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { categories } from '../../data/policies.js';

export default function PolicyCard({ policy }) {
  const { t } = useTranslation();
  const title = policy.title?.en || '';
  const catObj = categories.find(c => c.id === policy.category);
  const category = catObj ? catObj.name.en : (policy.category || '');

  return (
    <article className="policy-card">
      <div className="policy-card__header">
        <span className="policy-card__category">{category}</span>
        <span className="policy-card__version">v{policy.version}</span>
      </div>
      <h3 className="policy-card__title">
        <Link to={`/policies/${policy.id}`} className="policy-card__link">{title}</Link>
      </h3>
      <div className="policy-card__meta">
        <span className="policy-card__meta-item">
          <Calendar size={13} aria-hidden="true" />
          {policy.updated_at ? format(new Date(policy.updated_at), 'MMM d, yyyy') : ''}
        </span>
        {policy.tags?.length > 0 && (
          <span className="policy-card__meta-item">
            <Tag size={13} aria-hidden="true" />
            {policy.tags.slice(0, 2).join(', ')}
          </span>
        )}
      </div>
      <Link to={`/policies/${policy.id}`} className="policy-card__btn">
        <BookOpen size={14} aria-hidden="true" /> {t('policies.readMore')}
      </Link>
    </article>
  );
}
