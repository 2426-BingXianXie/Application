import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { permitTypes as permitTypesApi } from '../api/client';
import './PermitTypeListPage.css';

export default function PermitTypeListPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    permitTypesApi.list()
      .then(setList)
      .catch((err) => setError(err.body || 'Failed to load permit types'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loading">Loading permit types…</div>;
  if (error) return <div className="page-error">{error}</div>;

  const byCategory = list.reduce((acc, pt) => {
    const cat = pt.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(pt);
    return acc;
  }, {});

  return (
    <div className="permit-list-page">
      <h1>Online Permit Applications</h1>
      <p className="permit-list-intro">Select a permit type to apply.</p>
      {Object.entries(byCategory).map(([category, types]) => (
        <section key={category} className="permit-list-category">
          <h2>{category}</h2>
          <ul>
            {types.map((pt) => (
              <li key={pt.id}>
                <Link to={`/permits/apply/${pt.id}`}>{pt.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
