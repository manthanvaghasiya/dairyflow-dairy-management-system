import React, { useState } from 'react';
import './ShopRegisterPage.css';

// --- Final Shop Registration Page Component ---
// Added onNavigateToHome and onRegisterSuccess for better integration with App.js
export default function ShopRegisterPage({ onRegisterSuccess, onNavigateToLogin, onNavigateToHome }) {
    // --- State Management ---
    // Using simple, consistent variable names
    const [formData, setFormData] = useState({
        name: '', // CHANGED: from full_name to name
        email: '',
        password: '',
        shop_name: '',
        address: '',
        phone: '', // CHANGED: from phone_number to phone
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // --- API URL ---
    const REGISTER_API_URL = 'http://localhost:5000/api/users/register';

    // --- Event Handlers ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ text: '', type: '' });

        if (formData.password.length < 6) {
            setMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(REGISTER_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // The body now sends the exact fields the backend expects
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }
            
            // Call the success function passed from App.js
            onRegisterSuccess();

        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
            setIsLoading(false);
        }
    };

    return (
        <div className="login-register-container">
            <div className="form-container register">
                <button onClick={onNavigateToHome} className="back-to-home">← Back to Home</button>
                <h1 className="form-title">Register Your Shop</h1>
                
                {message.text && <div className={`message-box ${message.type}`}>{message.text}</div>}

                <form onSubmit={handleRegister}>
                    {/* User Details */}
                    <div className="form-group">
                        <label htmlFor="name">Owner's Full Name</label>
                        <input id="name" name="name" type="text" className="form-input" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Owner's Email</label>
                        <input id="email" name="email" type="email" className="form-input" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" name="password" type="password" className="form-input" value={formData.password} onChange={handleInputChange} required />
                    </div>

                    {/* Shop Details */}
                    <div className="form-group">
                        <label htmlFor="shop_name">Shop Name</label>
                        <input id="shop_name" name="shop_name" type="text" className="form-input" value={formData.shop_name} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Shop Address</label>
                        <input id="address" name="address" type="text" className="form-input" value={formData.address} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Shop Phone Number</label>
                        <input id="phone" name="phone" type="tel" className="form-input" value={formData.phone} onChange={handleInputChange} required />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>

                <p className="form-footer">
                    Already have an account?{' '}
                    <span onClick={onNavigateToLogin} className="link-style">
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
}
