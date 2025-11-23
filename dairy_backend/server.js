// --- Import Core Modules ---
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Securely manage environment variables

// --- Import All Route Handlers ---
const shopRoutes = require('./routes/shops');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const salesRoutes = require('./routes/sales');

// --- Initialize Express App ---
const app = express();
const PORT = process.env.PORT || 5000;

// --- Global Middleware ---
app.use(cors()); // Allow frontend to communicate with this backend
app.use(express.json()); // Parse incoming JSON data
app.use('/uploads', express.static('uploads')); // Serve uploaded images statically

// --- MongoDB Database Connection ---
const MONGO_URI = "mongodb+srv://dairy_user:Radhe07@cluster0.oqxoc54.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" ;

if (!MONGO_URI) {
  console.error("❌ FATAL ERROR: MONGO_URI is not defined in the .env file.");
  process.exit(1); // Stop the server if the database connection string is missing
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Database connection established successfully!"))
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); // Stop the server on a connection failure
  });

// --- API Route Definitions ---
// All routes are standardized with the '/api' prefix.
app.use('/api/shops', shopRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/sales', salesRoutes);

// --- Root Endpoint ---
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Dairy Management Backend API. Server is running." });
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is live and listening on port: ${PORT}`);
});
