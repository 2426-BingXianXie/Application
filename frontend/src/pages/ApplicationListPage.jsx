import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applications as applicationsApi } from '../api/client';
import './ApplicationListPage.css';

export default function ApplicationListPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    applicationsApi.list()
      .then(setList)
      .catch((err) => setError(err.body || 'Failed to load applications'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="page-message">
        <p>Please <Link to="/login">log in</Link> to view your applications.</p>
      </div>
    );
  }

  if (loading) return <div className="page-loading">Loading applications…</div>;
  if (error) return <div className="page-error">{error}</div>;

  return (
    <div className="application-list-page">
      <h1>My Applications</h1>
      {list.length === 0 ? (
        <p className="empty-message">You have no applications yet. <Link to="/permits">Apply for a permit</Link>.</p>
      ) : (
        <table className="application-table">
          <thead>
            <tr>
              <th>Permit type</th>
              <th>Status</th>
              <th>Submitted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((app) => (
              <tr key={app.id}>
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
