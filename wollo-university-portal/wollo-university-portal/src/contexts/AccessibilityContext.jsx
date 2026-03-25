import React, { createContext, useContext, useEffect, useState } from 'react';

const defaults = {
  fontSize: 100,
  highContrast: false,
  grayscale: false,
  dyslexiaFont: false,
  lineHeight: 1.5,
  letterSpacing: 0,
  pauseAnimations: false,
  highlightLinks: false,
};

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('wu_accessibility');
      return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    } catch { return defaults; }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--user-font-scale', settings.fontSize / 100);
    root.style.setProperty('--user-line-height', settings.lineHeight);
    root.style.setProperty('--user-letter-spacing', settings.letterSpacing + 'px');
    root.classList.toggle('high-contrast', settings.highContrast);
    root.classList.toggle('grayscale', settings.grayscale);
    root.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    root.classList.toggle('pause-animations', settings.pauseAnimations);
    root.classList.toggle('highlight-links', settings.highlightLinks);
    localStorage.setItem('wu_accessibility', JSON.stringify(settings));
  }, [settings]);

  const update = (key, value) => setSettings(s => ({ ...s, [key]: value }));
  const reset = () => setSettings(defaults);

  return (
    <AccessibilityContext.Provider value={{ settings, update, reset }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => useContext(AccessibilityContext);
