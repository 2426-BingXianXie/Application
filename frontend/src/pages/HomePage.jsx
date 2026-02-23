import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home">
      <h1>Online Permit Applications</h1>
      <p className="home-intro">
        Welcome to the City of Quincy, Massachusetts Inspectional Services online permitting portal.
        Apply for building permits, electrical, plumbing, and other permits online.
      </p>
      <div className="home-actions">
        <Link to="/permits" className="home-card">
          <h2>Apply for a Permit</h2>
          <p>View all permit types and start an application.</p>
        </Link>
        <Link to="/documents" className="home-card">
          <h2>Document Center</h2>
          <p>Search and browse public documents.</p>
        </Link>
        <Link to="/property-records" className="home-card">
          <h2>Property Records Search</h2>
          <p>Search property records.</p>
        </Link>
        {user && (
          <Link to="/applications" className="home-card">
            <h2>My Applications</h2>
            <p>View and manage your submitted applications.</p>
          </Link>
        )}
      </div>
    </div>
  );
}
