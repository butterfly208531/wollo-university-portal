import React from 'react';
import { useTranslation } from '../../contexts/LangContext';

export default function SkipLink() {
  const { t } = useTranslation();
  return (
    <a href="#main-content" className="skip-link">
      {t('common.skipToContent')}
    </a>
  );
}
