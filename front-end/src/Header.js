import './Header.css'
import logo from './logo.svg'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

/**
 * A React component that is used for the header displayed at the top of every page of the site.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const Header = props => {
  const location = useLocation();

  if (location.pathname === '/landing' || location.pathname === '/register' || location.pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/auth/logout`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <header className="Header-header">
      <nav className="Header-navbar">
        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/dashboard">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/chores">Chores</Link>
          </li>
          {/* <li className="nav-item">
            <Link to="/payments">Payments</Link>
          </li>
          {/* <li className="nav-item">
            <Link to="/skillswap">SkillSwap</Link>
          </li> */}
          <li className="nav-item">
            <Link to="/compatibility">Compatibility Finder</Link>
          </li>
          <li className="nav-item">
            <Link to="/profile">Profile</Link>
          </li>
          <li onClick={handleLogout} className="nav-item">
            <Link to="/landing">Logout</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

// make this component available to be imported into any other file
export default Header
