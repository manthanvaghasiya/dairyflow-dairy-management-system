import React from 'react';
import './PublicFooter.css'; // Make sure you have also created this CSS file

function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="public-footer">
      <p className="footer-credit-line">Designed & Developed by Manthan & Team</p>
      <p className="footer-copyright">&copy; {currentYear} Dairy Farm Shop. All Rights Reserved.</p>
    </footer>
  );
}

export default PublicFooter;
