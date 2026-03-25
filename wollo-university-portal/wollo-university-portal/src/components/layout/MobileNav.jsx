import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { Home, BookOpen, Search, Info } from 'lucide-react';

export default function MobileNav() {
  const { t } = useTranslation();
  return (
    <nav className="mobile-nav" aria-label="Mobile bottom navigation">
      <NavLink to="/" end className={({ isActive }) => `mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}>
        <Home size={20} aria-hidden="true" />
        <span>{t('nav.home')}</span>
      </NavLink>
      <NavLink to="/policies" className={({ isActive }) => `mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}>
        <BookOpen size={20} aria-hidden="true" />
        <span>{t('nav.policies')}</span>
      </NavLink>
      <NavLink to="/search" className={({ isActive }) => `mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}>
        <Search size={20} aria-hidden="true" />
        <span>{t('nav.search')}</span>
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => `mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}>
        <Info size={20} aria-hidden="true" />
        <span>{t('nav.about')}</span>
      </NavLink>
    </nav>
  );
}
