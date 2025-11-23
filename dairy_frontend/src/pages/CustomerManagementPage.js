import React, { useState, useEffect } from 'react';
import './ProductManagementPage.css'; // Uses the same CSS as the Product Management page

// --- Customer Management Page Component ---
export default function CustomerManagementPage({ shop }) {
  // --- API URLs ---
  const CUSTOMERS_API_URL = `http://localhost:5000/api/shops/${shop._id}/customers`;
  const ADD_CUSTOMER_URL = 'http://localhost:5000/api/customers/add';
  const UPDATE_CUSTOMER_URL = 'http://localhost:5000/api/customers/update';
  const DELETE_CUSTOMER_URL = 'http://localhost:5000/api/customers';

  // --- State Management ---
  const [customers, setCustomers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  // --- Data Fetching ---
  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(CUSTOMERS_API_URL);
        if (!response.ok) throw new Error("Failed to fetch customers.");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        setMessage({ text: error.message, type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, [shop._id, CUSTOMERS_API_URL]);

  // --- Form Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', address: '' });
    setEditingId(null);
  };

  // --- CRUD Operations ---
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const customerData = { ...formData, shop_id: shop._id };
    const isEditing = editingId !== null;
    const url = isEditing ? `${UPDATE_CUSTOMER_URL}/${editingId}` : ADD_CUSTOMER_URL;
    const method = 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save customer.');
      
      setMessage({ text: data.message, type: 'success' });
      const res = await fetch(CUSTOMERS_API_URL);
      const updatedCustomers = await res.json();
      setCustomers(updatedCustomers);
      resetForm();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingId(customer._id);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const response = await fetch(`${DELETE_CUSTOMER_URL}/${customerId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete customer.');

      setMessage({ text: data.message, type: 'success' });
      setCustomers(customers.filter(c => c._id !== customerId));
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <div className="page-layout">
      <div className="form-section">
        <div className="form-container">
          <h2 className="form-title">{editingId ? 'Edit Customer' : 'Add New Customer'}</h2>
          <form onSubmit={handleSaveCustomer}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" className="form-input" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" className="form-input" value={formData.email} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" className="form-input" value={formData.phone} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea id="address" name="address" className="form-input" value={formData.address} onChange={handleInputChange}></textarea>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{editingId ? 'Update Customer' : 'Save Customer'}</button>
              {editingId && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
            </div>
          </form>
        </div>
      </div>
      <div className="table-section">
        <h1 className="page-title">Customer List</h1>
        {message.text && <div className={`message-box ${message.type}`}>{message.text}</div>}
        <div className="table-container">
          <table>
            <thead>
              {/* **CHANGE:** Added Email column */}
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="5" className="text-center">Loading...</td></tr>
              ) : customers.map(customer => (
                <tr key={customer._id}>
                  <td className="font-medium">{customer.name}</td>
                  {/* **CHANGE:** Added Email data cell */}
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td className="actions-cell">
                    <button onClick={() => handleEditCustomer(customer)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDeleteCustomer(customer._id)} className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
