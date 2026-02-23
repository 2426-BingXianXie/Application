import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-inner">
          <Link to="/" className="layout-logo">Quincy MA – Inspectional Services</Link>
          <nav className="layout-nav">
            <Link to="/permits">Permits</Link>
            <Link to="/applications">My Applications</Link>
            <Link to="/documents">Document Center</Link>
            <Link to="/property-records">Property Records</Link>
            {user?.role === 'STAFF' && <Link to="/applications/staff">Staff – All Applications</Link>}
          </nav>
          <div className="layout-auth">
            {user ? (
              <>
                <span className="layout-user">{user.name}</span>
                <button type="button" onClick={handleLogout}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login">Log in</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>City of Quincy, Massachusetts – Online Permitting. For issues contact Inspectional Services at (617) 376-1450.</p>
      </footer>
    </div>
  );
}
