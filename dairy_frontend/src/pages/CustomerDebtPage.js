import React, { useState, useEffect } from 'react';
import './CustomerDebtPage.css'; // We will create this CSS file next

// --- Customer Debt Page Component ---
export default function CustomerDebtPage({ shop }) {
  // --- API URLs ---
  const CUSTOMERS_API_URL = `http://localhost:5000/api/shops/${shop._id}/customers`;
  const DEBT_API_URL = 'http://localhost:5000/api/sales/debt';
  const PAY_API_URL = 'http://localhost:5000/api/sales/pay';

  // --- State Management ---
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [unpaidSales, setUnpaidSales] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // --- Data Fetching ---
  // Fetch the list of all customers for this shop
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(CUSTOMERS_API_URL);
        if (!response.ok) throw new Error("Failed to fetch customers.");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        setMessage({ text: error.message, type: 'error' });
      }
    };
    fetchCustomers();
  }, [shop._id, CUSTOMERS_API_URL]);

  // Fetch unpaid sales whenever a new customer is selected
  useEffect(() => {
    if (!selectedCustomer) {
      setUnpaidSales([]);
      return;
    }
    const fetchDebt = async () => {
      setIsLoading(true);
      setMessage({ text: '', type: '' });
      try {
        const response = await fetch(`${DEBT_API_URL}/${selectedCustomer}`);
        if (!response.ok) throw new Error("Failed to fetch customer's debt.");
        const data = await response.json();
        setUnpaidSales(data);
      } catch (error) {
        setMessage({ text: error.message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDebt();
  }, [selectedCustomer]);

  // --- Core Logic ---
  const handlePayment = async (saleId, paymentMethod) => {
    try {
      const response = await fetch(`${PAY_API_URL}/${saleId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: paymentMethod }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Payment failed.');

      setMessage({ text: data.message, type: 'success' });
      // Remove the paid sale from the list to update the UI instantly
      setUnpaidSales(unpaidSales.filter(sale => sale._id !== saleId));
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const totalDebt = unpaidSales.reduce((sum, sale) => sum + sale.total_price, 0);

  return (
    <div className="debt-page">
      <h1 className="page-title">Customer Debt Management</h1>
      <div className="customer-selector-container">
        <label htmlFor="customer-select">Select a Customer to View Debt</label>
        <select
          id="customer-select"
          className="form-input"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
        >
          <option value="">-- Select Customer --</option>
          {customers.map(customer => (
            <option key={customer._id} value={customer._id}>{customer.name}</option>
          ))}
        </select>
      </div>

      {message.text && <div className={`message-box ${message.type}`}>{message.text}</div>}

      <div className="debt-details-container">
        {selectedCustomer ? (
          <>
            <div className="debt-summary-card">
              <h3>Total Outstanding Debt</h3>
              <p>₹{totalDebt.toFixed(2)}</p>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date of Sale</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="text-center">Loading debt...</td></tr>
                  ) : unpaidSales.length > 0 ? (
                    unpaidSales.map(sale => (
                      <tr key={sale._id}>
                        <td>{new Date(sale.createdAt).toLocaleDateString()}</td>
                        <td>{sale.items.map(item => item.name).join(', ')}</td>
                        <td>₹{sale.total_price.toFixed(2)}</td>
                        <td className="actions-cell">
                          <button onClick={() => handlePayment(sale._id, 'cash')} className="btn-pay cash">Pay Cash</button>
                          <button onClick={() => handlePayment(sale._id, 'online')} className="btn-pay online">Pay Online</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" className="text-center">This customer has no outstanding debt.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="placeholder-message">Please select a customer to see their debt details.</p>
        )}
      </div>
    </div>
  );
}
