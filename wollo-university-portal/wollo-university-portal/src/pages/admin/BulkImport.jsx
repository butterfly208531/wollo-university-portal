import React, { useState } from 'react';
import { useTranslation } from '../../contexts/LangContext';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { importPolicies } from '../../services/api';

export default function BulkImport() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;
    setImporting(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      await importPolicies(formData);
      setImported(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Import failed. Please check your file format.');
    } finally {
      setImporting(false);
    }
  };

  const reset = () => { setImported(false); setFile(null); setError(''); };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">{t('admin.importPolicies')}</h1>
      </div>

      {imported ? (
        <div className="import-success">
          <CheckCircle size={48} className="import-success__icon" aria-hidden="true" />
          <h2>Import Successful</h2>
          <p>Policies have been imported successfully.</p>
          <button className="btn btn--primary" onClick={reset}>Import More</button>
        </div>
      ) : (
        <div className="import-form-wrap">
          <div className="import-instructions">
            <h2><FileText size={18} aria-hidden="true" /> CSV Format</h2>
            <p>Upload a CSV file with the following columns:</p>
            <code className="import-code">title, content, category, tags</code>
          </div>

          {error && <p className="alert alert--error">{error}</p>}

          <form className="import-form" onSubmit={handleImport}>
            <label className="import-dropzone" htmlFor="csv-file">
              <Upload size={32} aria-hidden="true" />
              <span>{file ? file.name : 'Click or drag CSV file here'}</span>
              <input id="csv-file" type="file" accept=".csv" className="import-dropzone__input"
                onChange={e => setFile(e.target.files[0])} aria-label="Upload CSV file" />
            </label>
            <button type="submit" className="btn btn--primary" disabled={!file || importing}>
              <Upload size={16} /> {importing ? 'Importing...' : 'Import Policies'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
