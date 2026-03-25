import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { Sun, Moon, Globe, Menu, X, Search, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const LANGUAGES = [
  { code: 'en', label: 'English',      gtCode: 'en' },
  { code: 'am', label: 'አማርኛ',         gtCode: 'am' },
  { code: 'om', label: 'Afaan Oromoo', gtCode: 'om' },
  { code: 'ti', label: 'ትግርኛ',         gtCode: 'ti' },
  { code: 'so', label: 'Soomaali',     gtCode: 'so' },
];

function triggerGoogleTranslate(langCode) {
  // Set the Google Translate cookie and reload
  if (langCode === 'en') {
    // Restore original
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    window.location.reload();
    return;
  }
  const val = `/en/${langCode}`;
  document.cookie = `googtrans=${val}; path=/`;
  document.cookie = `googtrans=${val}; path=/; domain=${window.location.hostname}`;
  window.location.reload();
}

export default function Navbar() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const langRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Detect current active Google Translate language from cookie
  const currentGtLang = (() => {
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    return match ? match[1] : 'en';
  })();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) { navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`); setSearchVal(''); }
  };

  return (
    <header className="navbar" role="banner">
      <div className="navbar__container">
        <Link to="/" className="navbar__brand" aria-label="Wollo University Home">
          <img src="https://wu.edu.et/e-stem/assets/images/discover-mobile-350x350-53.png" alt="Wollo University Logo" className="navbar__logo-img" />
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">Wollo University</span>
            <span className="navbar__brand-sub">Academic Portal</span>
          </div>
        </Link>

        <nav className="navbar__nav" aria-label="Main navigation">
          <Link to="/" className="navbar__link">{t('nav.home')}</Link>
          <Link to="/policies" className="navbar__link">{t('nav.policies')}</Link>
          <Link to="/about" className="navbar__link">{t('nav.about')}</Link>
        </nav>

        <form className="navbar__search" onSubmit={handleSearch} role="search">
          <input
            type="search" value={searchVal} onChange={e => setSearchVal(e.target.value)}
            placeholder={t('hero.searchPlaceholder')} className="navbar__search-input"
            aria-label={t('nav.search')}
          />
          <button type="submit" className="navbar__search-btn" aria-label={t('nav.search')}>
            <Search size={16} />
          </button>
        </form>

        <div className="navbar__actions">

          {/* Language Switcher — triggers Google Translate */}
          <div className="navbar__lang" ref={langRef}>
            <button
              className="navbar__icon-btn"
              onClick={() => setLangOpen(o => !o)}
              aria-label="Select language"
              aria-expanded={langOpen}
            >
              <Globe size={18} />
            </button>
            {langOpen && (
              <div className="navbar__lang-dropdown">
                {LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    className={`navbar__lang-option ${currentGtLang === l.gtCode ? 'navbar__lang-option--active' : ''}`}
                    onClick={() => { triggerGoogleTranslate(l.gtCode); setLangOpen(false); }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="navbar__icon-btn" onClick={toggleTheme} aria-label={t('nav.theme')}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {isAdmin ? (
            <div className="navbar__user">
              <Link to="/admin/dashboard" className="navbar__icon-btn" aria-label={t('nav.dashboard')}><LayoutDashboard size={18} /></Link>
              <button className="navbar__icon-btn" onClick={() => { logout(); navigate('/'); }} aria-label={t('nav.logout')}><LogOut size={18} /></button>
            </div>
          ) : (
            <Link to="/admin/login" className="navbar__btn navbar__btn--primary">
              <User size={16} /> <span>{t('nav.login')}</span>
            </Link>
          )}

          <button className="navbar__icon-btn navbar__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu" aria-expanded={menuOpen}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="navbar__mobile-menu" role="navigation" aria-label="Mobile navigation">
          <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/policies" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>{t('nav.policies')}</Link>
          <Link to="/about" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
          {!isAdmin && <Link to="/admin/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>}
        </div>
      )}
    </header>
  );
}
