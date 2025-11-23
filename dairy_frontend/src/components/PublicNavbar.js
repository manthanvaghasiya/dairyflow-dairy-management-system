import React, { useState } from 'react';
import './PublicNavbar.css';

// **CHANGE:** Added onHomeClick to the props
function PublicNavbar({ onHomeClick, onLoginClick, onRegisterClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar-container">
      <div className="navbar-content">
        {/* **CHANGE:** Made the logo a clickable home button */}
        <div className="navbar-logo" onClick={onHomeClick} style={{ cursor: 'pointer' }}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4"></path></svg>
          <span>DairyFlow</span>
        </div>

        {/* Desktop Menu */}
        <div className="nav-links-desktop">
          {/* **NEW:** Added Home link */}
          <a href="#hero" onClick={onHomeClick} className="nav-link">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>

        <div className="nav-actions-desktop">
          <button onClick={onLoginClick} className="btn-login">Login</button>
          <button onClick={onRegisterClick} className="btn-register">Register Your Shop</button>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <button className="mobile-menu-button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {/* **NEW:** Added Home link for mobile */}
        <a href="#hero" onClick={() => { onHomeClick(); setIsMobileMenuOpen(false); }} className="nav-link-mobile">Home</a>
        <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="nav-link-mobile">Features</a>
        <a href="#about" onClick={() => setIsMobileMenuOpen(false)} className="nav-link-mobile">About</a>
        <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="nav-link-mobile">Contact</a>
        <div className="mobile-menu-actions">
            <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="btn-login">Login</button>
            <button onClick={() => { onRegisterClick(); setIsMobileMenuOpen(false); }} className="btn-register">Register</button>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;
