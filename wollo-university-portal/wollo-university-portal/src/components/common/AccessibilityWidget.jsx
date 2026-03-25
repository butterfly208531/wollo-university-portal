import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LangContext';
import { Accessibility, X, Plus, Minus } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export default function AccessibilityWidget() {
  const { t } = useTranslation();
  const { settings, update, reset } = useAccessibility();
  const [open, setOpen] = useState(false);

  return (
    <div className="a11y-widget" role="region" aria-label={t('accessibility.title')}>
      <button
        className="a11y-widget__trigger"
        onClick={() => setOpen(o => !o)}
        aria-label={t('nav.accessibility')}
        aria-expanded={open}
      >
        <Accessibility size={22} />
      </button>

      {open && (
        <div className="a11y-widget__panel" role="dialog" aria-label={t('accessibility.title')}>
          <div className="a11y-widget__header">
            <h2 className="a11y-widget__title">{t('accessibility.title')}</h2>
            <button className="a11y-widget__close" onClick={() => setOpen(false)} aria-label={t('common.close')}><X size={18} /></button>
          </div>

          <div className="a11y-widget__body">
            <div className="a11y-widget__row">
              <span>{t('accessibility.fontSize')}: {settings.fontSize}%</span>
              <div className="a11y-widget__controls">
                <button onClick={() => update('fontSize', Math.max(80, settings.fontSize - 10))} aria-label="Decrease font size"><Minus size={14} /></button>
                <button onClick={() => update('fontSize', Math.min(150, settings.fontSize + 10))} aria-label="Increase font size"><Plus size={14} /></button>
              </div>
            </div>

            {[
              ['highContrast', t('accessibility.highContrast')],
              ['grayscale', t('accessibility.grayscale')],
              ['dyslexiaFont', t('accessibility.dyslexiaFont')],
              ['pauseAnimations', t('accessibility.pauseAnimations')],
              ['highlightLinks', t('accessibility.highlightLinks')],
            ].map(([key, label]) => (
              <label key={key} className="a11y-widget__toggle">
                <span>{label}</span>
                <input type="checkbox" checked={settings[key]} onChange={e => update(key, e.target.checked)} />
                <span className="a11y-widget__switch" aria-hidden="true"></span>
              </label>
            ))}

            <div className="a11y-widget__row">
              <span>{t('accessibility.lineHeight')}</span>
              <div className="a11y-widget__controls">
                <button onClick={() => update('lineHeight', Math.max(1, settings.lineHeight - 0.25))} aria-label="Decrease line height"><Minus size={14} /></button>
                <button onClick={() => update('lineHeight', Math.min(3, settings.lineHeight + 0.25))} aria-label="Increase line height"><Plus size={14} /></button>
              </div>
            </div>

            <button className="a11y-widget__reset" onClick={reset}>{t('accessibility.reset')}</button>
          </div>
        </div>
      )}
    </div>
  );
}
