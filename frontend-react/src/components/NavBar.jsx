import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <Link to="/" onClick={closeMenu}>GM Consultants</Link>
      </div>
      <button
        className="navbar__toggle"
        aria-label="Toggle navigation menu"
        onClick={toggleMenu}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={`navbar__links ${open ? 'navbar__links--open' : ''}`}>
        <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
          Home
        </NavLink>
        <NavLink to="/services" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
          Services
        </NavLink>
        <NavLink to="/guidelines" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
          Guidelines
        </NavLink>
        <NavLink to="/consultation" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
          Consultation
        </NavLink>
        <a href="/login" onClick={closeMenu} className="navbar__cta">Admin Login</a>
      </nav>
    </header>
  );
};

export default NavBar;
