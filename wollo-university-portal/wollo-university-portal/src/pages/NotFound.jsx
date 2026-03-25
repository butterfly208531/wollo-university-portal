import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LangContext';

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="not-found">
      <div className="not-found__content">
        <div className="not-found__code" aria-hidden="true">404</div>
        <h1 className="not-found__title">{t('common.pageNotFound')}</h1>
        <p className="not-found__text">The page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn btn--primary">{t('common.goHome')}</Link>
      </div>
    </div>
  );
}
