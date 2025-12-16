import { Link } from 'react-router-dom';
import './CompatibilityFinder.css';
import { getCurrentUser } from '../api/users'

const CompatibilityFinder = () => {
  const user = getCurrentUser();

  if (!user) {
    return (
      <div style={{
        margin: '20px auto',
        padding: '20px',
        textAlign: 'center',
        maxWidth: '1200px'
      }}>
        <h2>Please log in to view compatibility finder</h2>
        <Link to="/login">
          <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Go to Login
          </button>
        </Link>
      </div>
    )}

  return (
    <div className="compat-page">
      <h1 className="compat-title">Compatibility Finder</h1>
      <p className="compat-subtitle">
        Choose what you’re looking for.
      </p>

      <div className="compat-buttons">
        <Link className="compat-btn"
              to="/compatibility/roommate/essay">
          Looking for roommate
        </Link>

        <Link className="compat-btn"
              to="/compatibility/room/profile">
          Looking for room
        </Link>
      </div>

      {/* <div className="compat-back">
        <Link to="/dashboard">&#8592; Back to Home</Link>
      </div> */}
    </div>
  );
};

export default CompatibilityFinder;