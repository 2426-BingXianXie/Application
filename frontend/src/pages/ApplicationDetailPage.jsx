import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applications as applicationsApi } from '../api/client';
import './ApplicationDetailPage.css';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [app, setApp] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [staffStatus, setStaffStatus] = useState('');
  const [staffNotes, setStaffNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadApp = () => {
    applicationsApi.getById(id)
      .then(setApp)
      .catch((err) => setError(err.status === 404 ? 'Application not found' : (err.body || 'Failed to load')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) return;
    loadApp();
  }, [user, id]);

  useEffect(() => {
    if (!app) return;
    applicationsApi.getDocuments(id)
      .then((list) => setDocuments(Array.isArray(list) ? list : []))
      .catch(() => setDocuments([]));
  }, [app, id]);

  const handleStaffUpdate = async (e) => {
    e.preventDefault();
    if (!staffStatus) return;
    setUpdating(true);
    setError('');
    try {
      const updated = await applicationsApi.update(id, { status: staffStatus, staffNotes });
      setApp(updated);
      setStaffStatus('');
      setStaffNotes('');
    } catch (err) {
      setError(err.body || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmitDraft = async () => {
    setUpdating(true);
    setError('');
    try {
      const updated = await applicationsApi.update(id, { submit: true });
      setApp(updated);
    } catch (err) {
      setError(err.body || 'Submit failed');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }
  if (loading) return <div className="page-loading">Loading application…</div>;
  if (error && !app) return <div className="page-error">{error}</div>;
  if (!app) return null;

  const isStaff = user.role === 'STAFF';
  const canEditDraft = !isStaff && app.status === 'DRAFT';

  return (
    <div className="application-detail-page">
      <h1>{app.permitTypeName}</h1>
      <p className="detail-status">
        Status: <span className={`status status-${app.status.toLowerCase()}`}>{app.status.replace('_', ' ')}</span>
      </p>
      {error && <div className="form-error">{error}</div>}

      <section className="detail-section">
        <h2>Applicant</h2>
        <p>{app.applicantName} – {app.applicantEmail}</p>
      </section>

      <section className="detail-section">
        <h2>Form data</h2>
        {app.formData && Object.keys(app.formData).length > 0 ? (
          <dl className="detail-data">
            {Object.entries(app.formData).map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{String(v)}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p>No form data.</p>
        )}
      </section>

      {app.staffNotes && (
        <section className="detail-section">
          <h2>Staff notes</h2>
          <p>{app.staffNotes}</p>
        </section>
      )}

      <section className="detail-section">
        <h2>Attachments</h2>
        {documents.length === 0 ? (
          <p>No attachments.</p>
        ) : (
          <ul className="doc-list">
            {documents.map((doc) => (
              <li key={doc.id}>
                <a href={`/api/documents/${doc.id}/file`} target="_blank" rel="noopener noreferrer">{doc.name}</a>
              </li>
            ))}
          </ul>
        )}
        <form
          className="upload-form"
          onSubmit={async (e) => {
            e.preventDefault();
            const input = e.target?.file?.files?.[0];
            if (!input) return;
            setUploading(true);
            setError('');
            try {
              await applicationsApi.uploadDocument(id, input);
              const list = await applicationsApi.getDocuments(id);
              setDocuments(Array.isArray(list) ? list : []);
              e.target.reset();
            } catch (err) {
              setError(err.body || 'Upload failed');
            } finally {
              setUploading(false);
            }
          }}
        >
          <input type="file" name="file" />
          <button type="submit" disabled={uploading}>{uploading ? 'Uploading…' : 'Upload'}</button>
        </form>
      </section>

      {canEditDraft && (
        <div className="detail-actions">
          <button type="button" onClick={handleSubmitDraft} disabled={updating}>
            {updating ? 'Submitting…' : 'Submit application'}
          </button>
        </div>
      )}

      {isStaff && (
        <form onSubmit={handleStaffUpdate} className="staff-update-form">
          <h2>Update status</h2>
          <label>
            Status
            <select value={staffStatus} onChange={(e) => setStaffStatus(e.target.value)} required>
              <option value="">Select…</option>
              <option value="UNDER_REVIEW">Under review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </label>
          <label>
            Notes
            <textarea value={staffNotes} onChange={(e) => setStaffNotes(e.target.value)} rows={3} />
          </label>
          <button type="submit" disabled={updating}>Update</button>
        </form>
      )}
    </div>
  );
}
