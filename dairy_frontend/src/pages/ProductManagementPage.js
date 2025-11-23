import React, { useState, useEffect } from 'react';
import './ProductManagementPage.css'; // Make sure to use the updated CSS

export default function ProductManagementPage({ shop }) {
  const PRODUCTS_API_URL = `http://localhost:5000/api/shops/${shop._id}/products`;
  const ADD_PRODUCT_URL = 'http://localhost:5000/api/products/add';
  const UPDATE_PRODUCT_URL = 'http://localhost:5000/api/products/update';
  const DELETE_PRODUCT_URL = 'http://localhost:5000/api/products';

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({ name: '', price: '', unit: 'Litre', stock_level: '', category: '', mfgDate: '', expDate: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showExpiringSoonOnly, setShowExpiringSoonOnly] = useState(false);

  useEffect(() => {
    // **FIX:** The fetchProducts function is now defined INSIDE the useEffect hook.
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(PRODUCTS_API_URL);
            if (!response.ok) throw new Error("Failed to fetch products.");
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (shop?._id) {
        fetchProducts();
    }
  }, [shop?._id, PRODUCTS_API_URL]); // **FIX:** The dependency array is now correct.

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', unit: 'Litre', stock_level: '', category: '', mfgDate: '', expDate: '' });
    setImageFile(null);
    setEditingId(null);
    if (document.getElementById('image')) document.getElementById('image').value = null;
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const submissionData = new FormData();
    Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
    submissionData.append('shop_id', shop._id);
    if (imageFile) {
      submissionData.append('image', imageFile);
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${UPDATE_PRODUCT_URL}/${editingId}` : ADD_PRODUCT_URL;
    const method = 'POST';

    try {
      const response = await fetch(url, { method, body: submissionData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to save product.');
      
      setMessage({ text: data.message, type: 'success' });
       // Refetch all products to get the latest data
      const productsRes = await fetch(PRODUCTS_API_URL);
      const updatedProducts = await productsRes.json();
      setProducts(updatedProducts);
      resetForm();
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleEditProduct = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      unit: product.unit,
      stock_level: product.stock_level,
      category: product.category || '',
      mfgDate: product.mfgDate ? product.mfgDate.split('T')[0] : '',
      expDate: product.expDate ? product.expDate.split('T')[0] : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`${DELETE_PRODUCT_URL}/${productId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete product.');

      setMessage({ text: data.message, type: 'success' });
      setProducts(products.filter(p => p._id !== productId));
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };
  
  const isExpiringSoon = (expDate) => {
    if (!expDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
    const expiryDate = new Date(expDate);
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 2);
    return expiryDate <= sevenDaysFromNow && expiryDate >= today;
  };

  const filteredProducts = products.filter(product => {
    const lowStockCondition = !showLowStockOnly || (showLowStockOnly && product.stock_level <= 10);
    const expiringSoonCondition = !showExpiringSoonOnly || (showExpiringSoonOnly && isExpiringSoon(product.expDate));
    return lowStockCondition && expiringSoonCondition;
  });

  return (
    <div className="page-layout">
      <div className="form-section">
        <div className="form-container">
          <h2 className="form-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSaveProduct}>
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input id="name" name="name" type="text" className="form-input" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input id="price" name="price" type="number" className="form-input" value={formData.price} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <select id="unit" name="unit" className="form-input" value={formData.unit} onChange={handleInputChange}>
                <option>Litre</option><option>500ml</option><option>Packet</option><option>kg</option><option>500g</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="stock_level">Stock Level</label>
              <input id="stock_level" name="stock_level" type="number" className="form-input" value={formData.stock_level} onChange={handleInputChange} required />
            </div>
             <div className="form-group">
              <label htmlFor="expDate">Expiry Date</label>
              <input id="expDate" name="expDate" type="date" className="form-input" value={formData.expDate} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input id="image" name="image" type="file" className="form-input" onChange={handleFileChange} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">{editingId ? 'Update Product' : 'Save Product'}</button>
              {editingId && <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>}
            </div>
          </form>
        </div>
      </div>
      <div className="table-section">
        <div className="table-header">
            <h1 className="page-title">Product Inventory</h1>
            <div className="filters-container">
                <div className="toggle-switch">
                    <input type="checkbox" id="lowStockToggle" checked={showLowStockOnly} onChange={() => setShowLowStockOnly(!showLowStockOnly)} />
                    <label htmlFor="lowStockToggle">Show Low Stock Only</label>
                </div>
                <div className="toggle-switch">
                    <input type="checkbox" id="expiringSoonToggle" checked={showExpiringSoonOnly} onChange={() => setShowExpiringSoonOnly(!showExpiringSoonOnly)} />
                    <label htmlFor="expiringSoonToggle">Show Expiring Soon</label>
                </div>
            </div>
        </div>
        {message.text && <div className={`message-box ${message.type}`}>{message.text}</div>}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan="6" className="text-center">Loading...</td></tr>
              ) : filteredProducts.map(product => {
                  const isLowStock = product.stock_level <= 10;
                  const expiringSoon = isExpiringSoon(product.expDate);
                  const rowClass = `${isLowStock ? 'low-stock' : ''} ${expiringSoon ? 'expiring-soon' : ''}`;

                  return (
                    <tr key={product._id} className={rowClass}>
                      <td><img src={`http://localhost:5000/${product.imageUrl}`} alt={product.name} className="table-image" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/60x60/EEE/31343C?text=No+Img" }}/></td>
                      <td className="font-medium">{product.name}</td>
                      <td>₹{product.price.toFixed(2)}</td>
                      <td>{product.stock_level}</td>
                      <td>{product.expDate ? new Date(product.expDate).toLocaleDateString() : 'N/A'}</td>
                      <td className="actions-cell">
                        <button onClick={() => handleEditProduct(product)} className="btn-edit">Edit</button>
                        <button onClick={() => handleDeleteProduct(product._id)} className="btn-delete">Delete</button>
                      </td>
                    </tr>
                  )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
