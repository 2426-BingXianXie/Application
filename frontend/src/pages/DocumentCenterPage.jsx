import { useEffect, useState } from 'react';
import { documents as documentsApi } from '../api/client';
import './DocumentCenterPage.css';

export default function DocumentCenterPage() {
  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = search ? { search } : category ? { category } : {};
    Promise.all([
      documentsApi.list(params),
      documentsApi.categories(),
    ])
      .then(([docs, cats]) => {
        setList(Array.isArray(docs) ? docs : []);
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, [category, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    const form = e.target;
    const q = form?.search?.value;
    setSearch(q || '');
  };

  if (loading) return <div className="page-loading">Loading documents…</div>;

  return (
    <div className="document-center-page">
      <h1>Document Center</h1>
      <p className="doc-intro">Search and browse public documents.</p>

      <form onSubmit={handleSearch} className="doc-search-form">
        <input name="search" type="text" placeholder="Search by file name" defaultValue={search} />
        <button type="submit">Search</button>
      </form>

      {categories.length > 0 && (
        <div className="doc-categories">
          <button type="button" className={!category ? 'active' : ''} onClick={() => setCategory('')}>All</button>
          {categories.map((c) => (
            <button key={c} type="button" className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <p className="empty-message">No documents found.</p>
      ) : (
        <ul className="doc-list">
          {list.map((doc) => (
            <li key={doc.id}>
              <a href={`/api/documents/${doc.id}/file`} target="_blank" rel="noopener noreferrer">{doc.name}</a>
              {doc.category && <span className="doc-cat">{doc.category}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
