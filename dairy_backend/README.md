# 🔙 DairyFlow Backend API

This is the server-side application for the **DairyFlow Management System**. It handles database connections, admin authentication, inventory logic, and image uploads.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via Mongoose)
* **Authentication:** JWT (JSON Web Tokens)
* **Image Handling:** Multer (for product image uploads)

## 📂 Folder Structure
Based on the MVC (Model-View-Controller) pattern:
* `models/` - Database schemas (User, Product, Sales).
* `routes/` - API endpoints.
* `uploads/` - Storage for product images.
* `server.js` - Entry point of the application.

## ⚙️ Installation & Setup

### 1. Install Dependencies
Navigate to the backend folder and install the required packages:
```bash
cd dairy_backend
npm install
2. Environment Variables (.env)
Create a .env file in the root of the dairy_backend folder. Add the following keys:

Code snippet

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
3. Run the Server
To start the backend server:

Bash

# Standard start
npm start

# Or if you use nodemon (for development)
npm run dev
The server usually runs on http://localhost:5000

🔌 Key API Endpoints
Authentication
POST /api/auth/login - Admin Login

POST /api/auth/register - Register new Admin (if applicable)

Products (Inventory)
GET /api/products - Fetch all dairy products

POST /api/products - Add a new product (requires Admin Token)

DELETE /api/products/:id - Remove a product

Sales
POST /api/sales - Record a new sale transaction
