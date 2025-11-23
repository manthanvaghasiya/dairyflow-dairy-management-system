import React, { useState, useEffect } from 'react';
import './SalesReportsPage.css'; // Uses the beautiful CSS file

export default function SalesReportsPage({ shop }) {
  const SALES_API_URL = `http://localhost:5000/api/sales/shop/${shop._id}`;

  // --- State Management ---
  const [allSales, setAllSales] = useState([]); // Stores all sales ever fetched
  const [displayedSales, setDisplayedSales] = useState([]); // Stores sales currently shown in the table
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for date filtering
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- Data Fetching ---
  useEffect(() => {
    const fetchSales = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(SALES_API_URL);
        if (!response.ok) throw new Error("Failed to fetch sales data.");
        const data = await response.json();
        setAllSales(data);

        // **NEW FEATURE:** Filter for the last 24 hours by default
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const recentSales = data.filter(sale => new Date(sale.createdAt) > twentyFourHoursAgo);
        setDisplayedSales(recentSales);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSales();
  }, [shop._id, SALES_API_URL]);

  // --- Calculation Logic ---
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const dailyRevenue = allSales
    .filter(sale => new Date(sale.createdAt) >= today && sale.payment_status === 'paid')
    .reduce((sum, sale) => sum + sale.total_price, 0);

  const monthlyRevenue = allSales
    .filter(sale => new Date(sale.createdAt) >= startOfMonth && sale.payment_status === 'paid')
    .reduce((sum, sale) => sum + sale.total_price, 0);

  const totalDebt = allSales
    .filter(sale => sale.payment_status === 'unpaid')
    .reduce((sum, sale) => sum + sale.total_price, 0);

  // **NEW FEATURE:** Total Transactions Calculation
  const totalTransactions = allSales.length;

  // --- Event Handlers for Date Filtering ---
  const handleDateFilter = () => {
    if (!startDate || !endDate) {
      setError("Please select both a start and end date.");
      return;
    }
    setError('');
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); 

    const filtered = allSales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= start && saleDate <= end;
    });
    setDisplayedSales(filtered);
  };

  const resetFilter = () => {
    setStartDate('');
    setEndDate('');
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSales = allSales.filter(sale => new Date(sale.createdAt) > twentyFourHoursAgo);
    setDisplayedSales(recentSales);
  };

  return (
    <div className="report-page">
      <h1 className="page-title">Sales Dashboard</h1>
      {error && <div className="message-box error">{error}</div>}

      {/* **CHANGE:** All stat cards are now in a single row */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Today's Revenue</h4>
          <p>₹{dailyRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>This Month's Revenue</h4>
          <p>₹{monthlyRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Outstanding Debt</h4>
          <p className="debt">{`₹${totalDebt.toFixed(2)}`}</p>
        </div>
        <div className="stat-card">
          <h4>Total Transactions</h4>
          <p>{totalTransactions}</p>
        </div>
      </div>

      <div className="report-section">
        <h2>Transactions History</h2>
        
        <div className="filter-section">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input 
              id="startDate"
              type="date" 
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input 
              id="endDate"
              type="date" 
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button className="btn-primary" onClick={handleDateFilter}>Filter</button>
          <button className="btn-secondary" onClick={resetFilter}>Reset</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Customer</th>
                <th>Payment</th>
                {/* **CHANGE:** Added Item Name column */}
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
              ) : displayedSales.length > 0 ? (
                displayedSales.map(sale => (
                  <tr key={sale._id}>
                    <td>{new Date(sale.createdAt).toLocaleString()}</td>
                    <td className="font-medium">{sale.customer_id?.name || 'Walk-in'}</td>
                    <td>
                      <span className={`payment-status ${sale.payment_status}`}>
                        {sale.payment_status === 'unpaid' 
                          ? 'Debt' 
                          : sale.payment_method.charAt(0).toUpperCase() + sale.payment_method.slice(1)}
                      </span>
                    </td>
                    {/* **CHANGE:** Displaying item names and quantities */}
                    <td className="items-cell">{sale.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</td>
                    <td>₹{sale.total_price.toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center">No transactions found for the selected period.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

