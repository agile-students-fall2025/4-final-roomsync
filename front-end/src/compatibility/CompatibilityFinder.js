import { Link } from 'react-router-dom';
import './CompatibilityFinder.css';


const CompatibilityFinder = () => {
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
              to="/compatibility/room/essay">
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