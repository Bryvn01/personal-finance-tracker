import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { t } from '../../utils/i18n';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          💰 Finance Tracker
        </Link>
        
        <div className="nav-menu">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            {t('Dashboard')}
          </Link>
          <Link 
            to="/transactions" 
            className={`nav-link ${isActive('/transactions') ? 'active' : ''}`}
          >
            {t('Transactions')}
          </Link>
          <Link 
            to="/budgets" 
            className={`nav-link ${isActive('/budgets') ? 'active' : ''}`}
          >
            {t('Budgets')}
          </Link>
          <Link 
            to="/analytics" 
            className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
          >
            {t('Analytics')}
          </Link>
        </div>
        
        <div className="nav-user">
          <span className="user-name">Welcome, {user?.username}</span>
          <button onClick={logout} className="btn-logout">
            {t('Logout')}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;