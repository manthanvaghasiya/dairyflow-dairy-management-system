import React, { useState } from 'react'; 
import './LoginPage.css'; // Correct   

// --- Login Page Component --- 
// **CHANGE:** Added onNavigateToHome to receive the navigation function 
export default function LoginPage({ onLoginSuccess, onNavigateToRegister, onNavigateToHome }) { 
 const [email, setEmail] = useState(''); 
 const [password, setPassword] = useState(''); 
 const [isLoading, setIsLoading] = useState(false); 
 const [message, setMessage] = useState({ text: '', type: '' }); 

 // --- API URL --- 
 const LOGIN_API_URL = 'http://localhost:5000/api/users/login'; 

 // --- Event Handler for Form Submission --- 
 const handleLogin = async (e) => { 
   e.preventDefault(); // Prevent the default browser form submission 
   setIsLoading(true); 
   setMessage({ text: '', type: '' }); // Clear any previous messages 

   try { 
     const response = await fetch(LOGIN_API_URL, { 
       method: 'POST', 
       headers: { 
         'Content-Type': 'application/json', 
       }, 
       body: JSON.stringify({ email, password }), 
     }); 

     const data = await response.json(); 

     if (!response.ok) { 
       // If the server responds with an error (e.g., 401 Unauthorized) 
       throw new Error(data.message || 'Login failed. Please try again.'); 
     } 

     // If login is successful, call the onLoginSuccess function from App.js 
     // and pass the user and shop data up. 
     onLoginSuccess(data); 

   } catch (error) { 
     // If there's an error with the fetch call or the server response 
     setMessage({ text: error.message, type: 'error' }); 
     setIsLoading(false); 
   } 
 }; 

 // --- Render Method --- 
 return ( 
   <div className="login-register-container"> 
     <div className="form-container"> 
       <h1 className="form-title">Dairy Management</h1> 
       <p className="text-center" style={{ marginTop: '-1rem', marginBottom: '2rem', color: 'var(--color-text-medium)' }}> 
         Admin Login 
       </p> 

       {message.text && <div className={`message-box ${message.type}`}>{message.text}</div>} 

       <form onSubmit={handleLogin}> 
         <div className="form-group"> 
           <label htmlFor="email">Email Address</label> 
           <input 
             id="email" 
             type="email" 
             className="form-input" 
             value={email} 
             onChange={(e) => setEmail(e.target.value)} 
             placeholder="you@example.com" 
             required 
           /> 
         </div> 
       <div className="form-group"> 
           <label htmlFor="password">Password</label> 
           <input 
             id="password" 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            /> 
          </div> 
          <button type="submit" className="btn btn-primary" disabled={isLoading}> 
            {isLoading ? 'Logging in...' : 'Login'} 
          </button> 
        </form> 

       <p className="text-center mt-1"> 
         Don't have an account?{' '} 
       <span onClick={onNavigateToRegister} className="link-style"> 
         Register your shop 
         </span> 
       </p> 

        {/* **NEW FEATURE:** Back to Home link */} 
        <p className="text-center mt-1"> 
            <span onClick={onNavigateToHome} className="link-style"> 
                Go Back to Home 
            </span> 
        </p> 
     </div> 
    </div>
 )
};