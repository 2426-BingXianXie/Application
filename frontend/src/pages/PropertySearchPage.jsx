import { useEffect, useState } from 'react';
import { propertyRecords as propertyRecordsApi } from '../api/client';
import './PropertySearchPage.css';

export default function PropertySearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearched(true);
    setLoading(true);
    try {
      const list = await propertyRecordsApi.search(query);
      setResults(list || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="property-search-page">
      <h1>Property Records Search</h1>
      <p className="prop-intro">Search by address or parcel ID.</p>

      <form onSubmit={handleSearch} className="prop-search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Address or parcel ID"
        />
        <button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</button>
      </form>

      {searched && !loading && (
        results.length === 0 ? (
          <p className="empty-message">No records found.</p>
        ) : (
          <div className="prop-results">
            <h2>Results</h2>
            <ul>
              {results.map((r) => (
                <li key={r.id} className="prop-card">
                  <strong>{r.address}</strong>
                  {r.parcelId && <span>Parcel: {r.parcelId}</span>}
                  {r.recordType && <span>Type: {r.recordType}</span>}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
}
