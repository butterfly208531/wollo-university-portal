import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RotateCcw, Clock } from 'lucide-react';
import { getPolicyVersions, restorePolicyVersion } from '../../services/api';

export default function VersionHistory() {
  const { id } = useParams();
  const [versions, setVersions] = useState([]);
  const [policyTitle, setPolicyTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getPolicyVersions(id)
      .then(res => {
        const data = res.data.data || res.data;
        if (Array.isArray(data)) {
          setVersions(data);
        } else {
          setVersions(data.versions || []);
          setPolicyTitle(data.policy?.title || '');
        }
      })
      .catch(() => setError('Failed to load version history.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRestore = async (versionId, versionNum) => {
    if (!window.confirm(`Restore to version ${versionNum}?`)) return;
    try {
      await restorePolicyVersion(id, versionId);
      alert(`Restored to version ${versionNum}`);
    } catch {
      alert('Failed to restore version.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Version History</h1>
        {policyTitle && <p className="admin-page__subtitle">{policyTitle}</p>}
      </div>

      {loading && <p className="admin-loading">Loading...</p>}
      {error && <p className="alert alert--error">{error}</p>}

      {!loading && !error && (
        <div className="version-timeline">
          {versions.length === 0 && <p>No version history available.</p>}
          {versions.map((v, i) => (
            <div key={v.id || i} className={`version-item ${i === 0 ? 'version-item--current' : ''}`}>
              <div className="version-item__dot" aria-hidden="true"></div>
              <div className="version-item__content">
                <div className="version-item__header">
                  <span className="version-item__version">v{v.version || v.version_number}</span>
                  {i === 0 && <span className="badge badge--green">Current</span>}
                </div>
                <p className="version-item__changes">{v.changes || v.change_summary || 'No description'}</p>
                <div className="version-item__meta">
                  <span><Clock size={12} aria-hidden="true" /> {v.created_at ? new Date(v.created_at).toLocaleDateString() : v.date}</span>
                  <span>by {v.created_by || v.author || 'Admin'}</span>
                </div>
                {i > 0 && (
                  <button className="btn btn--outline btn--sm" onClick={() => handleRestore(v.id, v.version || v.version_number)}>
                    <RotateCcw size={14} /> Restore this version
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/admin/policies" className="btn btn--outline">← Back to Policies</Link>
    </div>
  );
}
