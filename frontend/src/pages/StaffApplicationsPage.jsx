import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applications as applicationsApi } from '../api/client';
import './ApplicationListPage.css';

export default function StaffApplicationsPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    applicationsApi.listStaff()
      .then(setList)
      .catch((err) => setError(err.body || 'Failed to load applications'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || user.role !== 'STAFF') {
    return (
      <div className="page-message">
        <p>Staff access only.</p>
      </div>
    );
  }

  if (loading) return <div className="page-loading">Loading applications…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="application-list-page">
      <h1>All Applications (Staff)</h1>
      {list.length === 0 ? (
        <p className="empty-message">No applications yet.</p>
      ) : (
        <table className="application-table">
          <thead>
            <tr>
              <th>Applicant</th>
              <th>Permit type</th>
              <th>Status</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((app) => (
              <tr key={app.id}>
                <td>{app.applicantName}</td>
                <td>{app.permitTypeName}</td>
                <td><span className={`status status-${app.status.toLowerCase()}`}>{app.status.replace('_', ' ')}</span></td>
                <td>{app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : '—'}</td>
                <td><Link to={`/applications/${app.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
