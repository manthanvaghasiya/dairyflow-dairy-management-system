import React, { useState, useEffect } from 'react';
import './App.css'; // Global styles for the application

// Import all the page and component files
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ShopRegisterPage from './pages/ShopRegisterPage';
import HomePage from './pages/HomePage';
import PublicNavbar from './components/PublicNavbar';
import PublicFooter from './components/PublicFooter';

function App() {
  // State to manage the user and shop data once logged in
  const [authData, setAuthData] = useState(null);
  // The default view is 'home'
  const [view, setView] = useState('home');
  // State to track if we are checking for existing session data
  const [isLoading, setIsLoading] = useState(true);
  // **NEW:** A state to show messages like "Registration Successful"
  const [message, setMessage] = useState('');

  // --- Session Management ---
  // On initial app load, check if user data exists in localStorage
  useEffect(() => {
    try {
      const storedAuthData = localStorage.getItem('authData');
      if (storedAuthData) {
        setAuthData(JSON.parse(storedAuthData));
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem('authData');
    }
    setIsLoading(false); // Finished checking
  }, []);

  // --- Event Handlers ---
  const handleLogin = (data) => {
    setAuthData(data);
    localStorage.setItem('authData', JSON.stringify(data));
    setMessage(''); // Clear any messages on login
  };

  // **THIS IS THE FIX:** A new function to handle a successful registration
  const handleRegisterSuccess = () => {
    setMessage('Registration successful! Please log in to continue.');
    setView('login'); // Navigate to the login page
  };

  const handleLogout = () => {
    setAuthData(null);
    setView('home'); // On logout, return to the homepage
    localStorage.removeItem('authData');
  };
  
  // A helper function to clear messages when changing views
  const navigate = (newView) => {
    setMessage('');
    setView(newView);
  }

  // --- Main Render Logic ---

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }

  // If authData exists, the user is logged in. Show the Admin Dashboard.
  if (authData && authData.user && authData.shop) {
    return (
      <AdminDashboard 
        user={authData.user} 
        shop={authData.shop}
        onLogout={handleLogout} 
      />
    );
  }
  
  // If no user is logged in, decide which public page to show.
  switch (view) {
    case 'login':
      // The Login page is rendered by itself, without the navbar or footer
      return (
        <LoginPage 
          onLoginSuccess={handleLogin} 
          onNavigateToRegister={() => navigate('register')} 
          onNavigateToHome={() => navigate('home')} 
        />
      );
    case 'register':
      // The Register page is also rendered by itself
      return (
        <ShopRegisterPage 
          // **THIS IS THE FIX:** Pass the new function down as a prop
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => navigate('login')} 
          onNavigateToHome={() => navigate('home')}
        />
      );
    case 'home':
    default:
      // Only the Homepage gets the Public Navbar and Footer
      return (
        <div>
          <PublicNavbar 
            onHomeClick={() => navigate('home')}
            onLoginClick={() => navigate('login')} 
            onRegisterClick={() => navigate('register')} 
          />
          {/* A global message bar for notifications */}
          {message && <p className="global-success-message">{message}</p>}
          <HomePage onRegisterClick={() => navigate('register')} />
          <PublicFooter />
        </div>
      );
  }
}

export default App;

