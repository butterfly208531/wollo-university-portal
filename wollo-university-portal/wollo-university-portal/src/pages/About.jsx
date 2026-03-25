import React from 'react';
import { useTranslation } from '../contexts/LangContext';
import { Target, Star } from 'lucide-react';
import Breadcrumbs from '../components/common/Breadcrumbs';

export default function About() {
  const { t } = useTranslation();
  const valuesList = t('about.values_list', { returnObjects: true });

  return (
    <div className="about-page">
      <div className="about-page__header">
        <div className="section-container">
          <Breadcrumbs items={[{ label: t('nav.home'), href: '/' }, { label: t('nav.about'), href: '/about' }]} />
          <h1 className="page-title">{t('about.title')}</h1>
        </div>
      </div>

      <div className="section-container about-page__body">

        {/* Mission */}
        <section className="about-doc-section" aria-labelledby="mission-title">
          <div className="about-doc-section__header">
            <Target size={28} className="about-doc-section__icon about-doc-section__icon--blue" aria-hidden="true" />
            <h2 id="mission-title" className="about-doc-section__title">{t('about.mission')}</h2>
          </div>
          <p className="about-doc-section__lead">{t('about.missionHeading')}</p>
          <blockquote className="about-doc-section__quote">
            {t('about.missionText')}
          </blockquote>
        </section>

        {/* Values */}
        <section className="about-doc-section" aria-labelledby="values-title">
          <div className="about-doc-section__header">
            <Star size={28} className="about-doc-section__icon about-doc-section__icon--orange" aria-hidden="true" />
            <h2 id="values-title" className="about-doc-section__title">{t('about.values')}</h2>
          </div>
          <ol className="about-values-list" aria-label="Core values">
            {Array.isArray(valuesList) && valuesList.map((val, i) => {
              const [label, ...rest] = val.split(':');
              return (
                <li key={i} className="about-values-list__item">
                  <span className="about-values-list__num">{i + 1}</span>
                  <div className="about-values-list__body">
                    <strong className="about-values-list__label">{label}:</strong>
                    <span className="about-values-list__text">{rest.join(':')}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* University Facts */}
        <section className="about-history" aria-labelledby="facts-title">
          <h2 id="facts-title" className="section-title">{t('about.universityFacts')}</h2>
          <p>{t('about.universityDesc1')}</p>
          <p>{t('about.universityDesc2')}</p>
          <div className="about-facts">
            {[
              { label: t('about.established'), value: '2007' },
              { label: t('about.location'), value: 'Dessie, Ethiopia' },
              { label: t('about.programs'), value: '50+' },
              { label: t('about.students'), value: '25,000+' },
              { label: t('about.faculties'), value: '8' },
              { label: t('about.campuses'), value: '3' },
            ].map((f, i) => (
              <div key={i} className="about-fact">
                <span className="about-fact__value">{f.value}</span>
                <span className="about-fact__label">{f.label}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

