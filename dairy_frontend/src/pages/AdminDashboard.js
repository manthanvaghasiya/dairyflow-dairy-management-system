import React, { useState } from 'react';
import './AdminDashboard.css';

// Import all the management pages
import ProductManagementPage from './ProductManagementPage';
import CustomerManagementPage from './CustomerManagementPage';
import DailySalesPage from './DailySalesPage';
import SalesReportsPage from './SalesReportsPage';
import CustomerDebtPage from './CustomerDebtPage'; // Import the new debt page

function AdminDashboard({ user, shop, onLogout }) {
  const [activeView, setActiveView] = useState('sales');

  // This function decides which component to show based on the active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'products':
        return <ProductManagementPage shop={shop} />;
      case 'customers':
        return <CustomerManagementPage shop={shop} />;
      case 'sales':
        return <DailySalesPage user={user} shop={shop} />;
      case 'reports':
        return <SalesReportsPage shop={shop} />;
      // **NEW:** Add the case for the customer debt page
      case 'debt':
        return <CustomerDebtPage shop={shop} />;
      default:
        return <DailySalesPage user={user} shop={shop} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- Sidebar Navigation --- */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>{shop.shop_name}</h3>
          <p>Admin Panel</p>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li 
              className={activeView === 'sales' ? 'active' : ''}
              onClick={() => setActiveView('sales')}
            >
              Daily Sales
            </li>
            <li 
              className={activeView === 'products' ? 'active' : ''}
              onClick={() => setActiveView('products')}
            >
              Manage Products
            </li>
            <li 
              className={activeView === 'customers' ? 'active' : ''}
              onClick={() => setActiveView('customers')}
            >
              Manage Customers
            </li>
            {/* **NEW:** Add the navigation link for the Customer Debt page */}
            <li 
              className={activeView === 'debt' ? 'active' : ''}
              onClick={() => setActiveView('debt')}
            >
              Customer Debt
            </li>
            <li 
              className={activeView === 'reports' ? 'active' : ''}
              onClick={() => setActiveView('reports')}
            >
              Sales Reports
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <p className="user-name">{user.full_name}</p>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <main className="main-content">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default AdminDashboard;
