import React, { useState, useEffect } from 'react';
import './DailySalesPage.css';

// --- API URLs ---
const SALES_API_URL = 'http://localhost:5000/api/sales/add';
const ADD_CUSTOMER_URL = 'http://localhost:5000/api/customers/add';

// --- Main Daily Sales Page Component ---
export default function DailySalesPage({ user, shop }) {
  const PRODUCTS_API_URL = `http://localhost:5000/api/shops/${shop._id}/products`;
  const CUSTOMERS_API_URL = `http://localhost:5000/api/shops/${shop._id}/customers`;

  // ... (all other state remains the same)
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [currentSale, setCurrentSale] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [saleType, setSaleType] = useState('cash');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [saleStep, setSaleStep] = useState(1);


  // --- Data Fetching ---
  useEffect(() => {
    // **FIX:** The fetchData function is now defined INSIDE the useEffect hook.
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [productsRes, customersRes] = await Promise.all([
                fetch(PRODUCTS_API_URL),
                fetch(CUSTOMERS_API_URL)
            ]);
            if (!productsRes.ok || !customersRes.ok) throw new Error("Server connection failed.");
            
            const productsData = await productsRes.json();
            const customersData = await customersRes.json();
            setProducts(productsData);
            setCustomers(customersData);
        } catch (err) {
            setMessage({ text: err.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
  
    // We call the function immediately after defining it.
    fetchData();
    // **FIX:** The dependency array now correctly includes the URLs.
  }, [shop._id, PRODUCTS_API_URL, CUSTOMERS_API_URL]);

  // --- (The rest of your component's code remains exactly the same) ---
  const addProductToSale = (productToAdd) => {
    const itemInCart = currentSale.find(item => item._id === productToAdd._id);
    const quantityInCart = itemInCart ? itemInCart.quantity : 0;

    if (productToAdd.stock_level <= quantityInCart) {
      setMessage({ text: `${productToAdd.name} is out of stock.`, type: 'error' });
      return;
    }
    
    if (itemInCart) {
      setCurrentSale(currentSale.map(item =>
        item._id === productToAdd._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCurrentSale([...currentSale, { ...productToAdd, quantity: 1 }]);
    }
  };
  
  const handleProceedToPayment = () => {
      if (currentSale.length === 0) {
          setMessage({ text: "Please add products to the sale first.", type: 'error' });
          return;
      }
      setSaleStep(2);
  };

  const handleRecordSale = async () => {
    setMessage({ text: '', type: '' });
    if (saleType === 'tab' && !selectedCustomer) {
      setMessage({ text: "Please select a customer for a tab sale.", type: 'error' });
      return;
    }

    const payment_status = paymentMethod === 'unpaid' ? 'unpaid' : 'paid';
    const final_payment_method = payment_status === 'paid' ? paymentMethod : 'none';

    const saleData = {
      shop_id: shop._id,
      customer_id: saleType === 'tab' ? selectedCustomer : null,
      items: currentSale.map(item => ({ product_id: item._id, name: item.name, price: item.price, quantity: item.quantity })),
      total_price: calculateTotal(),
      sale_type: saleType,
      payment_status,
      payment_method: final_payment_method,
    };

    try {
      const response = await fetch(SALES_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to record sale.");
      
      setMessage({ text: "Sale recorded successfully!", type: 'success' });
      setCurrentSale([]);
      setSelectedCustomer('');
      setSaleType('cash');
      setPaymentMethod('cash');
      setSaleStep(1);
      // Refetch data after a sale to update product stock
      const productsRes = await fetch(PRODUCTS_API_URL);
      const updatedProducts = await productsRes.json();
      setProducts(updatedProducts);
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    }
  };

  const handleNewCustomerSaved = () => {
    // Refetch customers after adding a new one
    fetch(CUSTOMERS_API_URL)
        .then(res => res.json())
        .then(data => setCustomers(data));
    setSaleType('tab');
    setShowNewCustomerForm(false);
  };
  
  const calculateTotal = () => {
    return currentSale.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="sales-page">
      <div className="product-grid-container">
        <header className="sales-header">
          <h1>Today's Sales</h1>
          <p>Click a product to add it to the current sale.</p>
        </header>
        {message.text && <div className={`message-box ${message.type}`}>{message.text}</div>}
        {isLoading ? <p className="loading-message">Loading...</p> : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card" onClick={() => addProductToSale(product)}>
                <img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className="product-card-image" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/200x200/EEE/31343C?text=No+Img" }}/>
                <div className="product-card-info">
                  <h3 className="product-card-name">{product.name}</h3>
                  <p className="product-card-unit">{product.unit}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="current-sale-container">
        {saleStep === 1 && (
          <div className="sale-summary">
            <h2>Current Sale</h2>
            <ul className="sale-items-list">
              {currentSale.length === 0 ? (
                <li className="empty-sale-message">No items added yet.</li>
              ) : (
                currentSale.map(item => (
                  <li key={item._id} className="sale-item">
                    <span className="item-name">{item.name} (x{item.quantity})</span>
                    <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))
              )}
            </ul>
            <div className="sale-total">
              <strong>Total:</strong>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <button className="btn btn-primary" onClick={handleProceedToPayment} disabled={currentSale.length === 0}>
              Next: Finalize Sale
            </button>
          </div>
        )}

        {saleStep === 2 && (
          <div className="sale-summary">
            <h2>Finalize Sale</h2>
            <div className="customer-selection-area">
              <div className="form-group">
                <label htmlFor="saleType">Sale Type</label>
                <select id="saleType" className="form-input" value={showNewCustomerForm ? 'new_customer' : saleType} onChange={(e) => {
                    if (e.target.value === 'new_customer') { setShowNewCustomerForm(true); } 
                    else { setShowNewCustomerForm(false); setSaleType(e.target.value); }
                }}>
                  <option value="cash">Cash Sale</option>
                  <option value="tab">Customer Tab</option>
                  <option value="new_customer">Add New Customer</option>
                </select>
              </div>
              {showNewCustomerForm ? (
                <NewCustomerForm shopId={shop._id} onSave={handleNewCustomerSaved} onCancel={() => setShowNewCustomerForm(false)} />
              ) : saleType === 'tab' && (
                <div className="form-group">
                  <label htmlFor="customer">Select Customer</label>
                  <select id="customer" className="form-input" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                    <option value="">-- Select Customer --</option>
                    {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="payment-method-area">
              <h4>Payment Method</h4>
              <div className="payment-options">
                <button className={`payment-btn ${paymentMethod === 'cash' ? 'active' : ''}`} onClick={() => setPaymentMethod('cash')}>Paid by Cash</button>
                <button className={`payment-btn ${paymentMethod === 'online' ? 'active' : ''}`} onClick={() => setPaymentMethod('online')}>Paid Online</button>
                {saleType === 'tab' && selectedCustomer && (
                  <button className={`payment-btn unpaid ${paymentMethod === 'unpaid' ? 'active' : ''}`} onClick={() => setPaymentMethod('unpaid')}>Add to Debt</button>
                )}
              </div>
            </div>
            <div className="sale-total">
              <strong>Total:</strong>
              <span>₹{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="finalize-actions">
                <button className="btn-secondary" onClick={() => setSaleStep(1)}>Back</button>
                <button className="btn-primary" onClick={handleRecordSale}>Complete Sale</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Helper Component for the Add New Customer Form ---
const NewCustomerForm = ({ shopId, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    // **CHANGE:** Address is now required, email is optional
    if (!formData.name || !formData.phone || !formData.address) {
      setError("Please fill name, phone, and address.");
      return;
    }
    try {
      const response = await fetch(ADD_CUSTOMER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, shop_id: shopId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to add customer.");
      onSave(); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="new-customer-form">
      <h4>Add New Customer</h4>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input" required/>
      </div>
      <div className="form-group">
        <input type="email" placeholder="Email (Optional)" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input" />
      </div>
      <div className="form-group">
        <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="form-input" required/>
      </div>
      <div className="form-group">
        <textarea placeholder="Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="form-input" required></textarea>
      </div>
      <div className="new-customer-actions">
        <button onClick={onCancel} className="btn-secondary">Cancel</button>
        <button onClick={handleSave} className="btn-primary">Save</button>
      </div>
    </div>
  );
};
