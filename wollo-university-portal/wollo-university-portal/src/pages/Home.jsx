import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/LangContext';
import { BookOpen, Users, Award, Globe } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import PolicyCard from '../components/common/PolicyCard';
import { getCategories, getPolicies } from '../services/api';

export default function Home() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
    getPolicies({ per_page: 6 }).then(r => setFeatured(r.data.data)).catch(() => {});
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__container">
          <div className="hero__badge">Official Academic Portal</div>
          <h1 id="hero-title" className="hero__title">{t('hero.title')}</h1>
          <p className="hero__subtitle">{t('hero.subtitle')}</p>
          <SearchBar large />
          <div className="hero__actions">
            <Link to="/policies" className="btn btn--primary">{t('hero.browseAll')}</Link>
            <Link to="/about" className="btn btn--outline">{t('hero.learnMore')}</Link>
          </div>
        </div>
        <div className="hero__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none"><path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" /></svg>
        </div>
      </section>

      {/* Stats */}
      <section className="stats" aria-label="University statistics">
        <div className="stats__container">
          {[
            { icon: <BookOpen size={28} />, value: '12+', label: t('categories.title') },
            { icon: <Users size={28} />, value: '25,000+', label: t('about.students') },
            { icon: <Award size={28} />, value: '50+', label: t('about.programs') },
            { icon: <Globe size={28} />, value: '5', label: t('nav.language') },          ].map((s, i) => (
            <div key={i} className="stats__item">
              <div className="stats__icon" aria-hidden="true">{s.icon}</div>
              <div className="stats__value">{s.value}</div>
              <div className="stats__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section" aria-labelledby="categories-title">
        <div className="section-container">
          <h2 id="categories-title" className="section-title">{t('categories.title')}</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/policies?category=${cat.slug}`} className="category-card">
                <span className="category-card__name">{cat.name.en}</span>
                <span className="category-card__count">{cat.count} {t('policies.title').split(' ')[0]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Policies */}
      <section className="featured-section" aria-labelledby="featured-title">
        <div className="section-container">
          <div className="section-header">
            <h2 id="featured-title" className="section-title">{t('policies.title')}</h2>
            <Link to="/policies" className="btn btn--outline btn--sm">{t('hero.browseAll')}</Link>
          </div>
          <div className="policies-grid">
            {featured.map(p => <PolicyCard key={p.id} policy={p} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" aria-labelledby="cta-title">
        <div className="cta-section__container">
          <h2 id="cta-title" className="cta-section__title">{t('search.cta')}</h2>
          <p className="cta-section__text">{t('search.placeholder')}</p>
          <Link to="/search" className="btn btn--white">{t('hero.browseAll')}</Link>
        </div>
      </section>
    </div>
  );
}
