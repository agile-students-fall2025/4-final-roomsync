import './Header.css'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

/**
 * A React component that is used for the header displayed at the top of every page of the site.
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component, in JSX form.
 */
const Header = props => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (location.pathname === '/' || location.pathname === '/register' || location.pathname === '/login') {
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
    <header className="header">
      <nav className="navbar">

        {/* LOGO OR TITLE */}
        <div className="nav-logo">
          <Link to="/dashboard">RoomSync</Link>
        </div>

        {/* HAMBURGER MENU BUTTON */}
        <button 
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <ul className={menuOpen ? "nav-links mobile-open" : "nav-links"}>
          <li><Link to="/dashboard" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/chores" onClick={() => setMenuOpen(false)}>Chores</Link></li>
          <li><Link to="/compatibility" onClick={() => setMenuOpen(false)}>Compatibility Finder</Link></li>
          <li><Link to="/SkillSwap" onClick={() => setMenuOpen(false)}>Skill Swap</Link></li>
          <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
          <li onClick={handleLogout}><Link to="/" onClick={() => setMenuOpen(false)}>Logout</Link></li>
        </ul>

      </nav>
    </header>
  )
}

// make this component available to be imported into any other file
export default Header
