import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../contexts/LangContext';
import { Search, Mic, MicOff } from 'lucide-react';
import { useSearch } from '../../contexts/SearchContext';

export default function SearchBar({ large = false, initialValue = '' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addRecentSearch } = useSearch();
  const [value, setValue] = useState(initialValue);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = value.trim();
    if (q) { addRecentSearch(q); navigate(`/search?q=${encodeURIComponent(q)}`); }
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.onresult = (e) => { setValue(e.results[0][0].transcript); setListening(false); };
    rec.onend = () => setListening(false);
    rec.start();
    recognitionRef.current = rec;
    setListening(true);
  };

  return (
    <form className={`search-bar ${large ? 'search-bar--large' : ''}`} onSubmit={handleSubmit} role="search">
      <div className="search-bar__inner">
        <Search className="search-bar__icon" size={large ? 20 : 16} aria-hidden="true" />
        <input
          type="search" value={value} onChange={e => setValue(e.target.value)}
          placeholder={t('search.placeholder')} className="search-bar__input"
          aria-label={t('nav.search')}
        />
        <button type="button" className="search-bar__voice" onClick={startVoice} aria-label={t('search.voiceSearch')} aria-pressed={listening}>
          {listening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>
        <button type="submit" className="search-bar__submit">{t('nav.search')}</button>
      </div>
    </form>
  );
}
