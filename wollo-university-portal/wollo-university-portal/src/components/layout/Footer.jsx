import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <img src="https://wu.edu.et/e-stem/assets/images/discover-mobile-350x350-53.png" alt="Wollo University Logo" className="footer__logo-img" />
          <p className="footer__tagline">Wollo University<br />Academic Portal</p>
          <p className="footer__motto">{t('about.mottoText')}</p>
        </div>
        <div className="footer__links">
          <h3 className="footer__heading">{t('footer.quickLinks')}</h3>
          <Link to="/" className="footer__link">{t('nav.home')}</Link>
          <Link to="/policies" className="footer__link">{t('nav.policies')}</Link>
          <Link to="/about" className="footer__link">{t('nav.about')}</Link>
          <Link to="/search" className="footer__link">{t('nav.search')}</Link>
        </div>
        <div className="footer__contact">
          <h3 className="footer__heading">{t('footer.contact')}</h3>
          <p className="footer__contact-item"><MapPin size={14} aria-hidden="true" /> {t('footer.address')}</p>
          <p className="footer__contact-item"><Phone size={14} aria-hidden="true" /> {t('footer.phone')}</p>
          <p className="footer__contact-item"><Mail size={14} aria-hidden="true" /> {t('footer.email')}</p>
        </div>
        <div className="footer__legal">
          <h3 className="footer__heading">{t('footer.legal')}</h3>
          <Link to="/privacy" className="footer__link">{t('footer.privacy')}</Link>
          <Link to="/terms" className="footer__link">{t('footer.terms')}</Link>
        </div>
      </div>
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Wollo University. {t('footer.rights')}.</p>
      </div>
    </footer>
  );
}
