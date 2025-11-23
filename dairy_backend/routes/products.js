const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/product.model');

// --- Image Upload Configuration (using Multer) ---
// This sets up how and where to store uploaded files.
const storage = multer.diskStorage({
  destination: './uploads/', // The folder where product images will be saved
  filename: function(req, file, cb) {
    // Creates a unique filename (e.g., image-1678886400000.png) to prevent file conflicts
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// This function initializes multer with the storage configuration and file filters.
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // Limit file size to 2MB
  fileFilter: function(req, file, cb) {
    // This function ensures that only image files are uploaded
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb('Error: You can only upload image files!');
  }
}).single('image'); // 'image' must match the name attribute of the file input in the frontend form

// --- API Routes for Products ---

// POST: Add a new product
// Endpoint: /api/products/add
router.route('/add').post((req, res) => {
  // Use the 'upload' middleware to handle the file upload first
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    const { name, price, unit, stock_level, category, mfgDate, expDate, shop_id } = req.body;

    if (!name || !price || !unit || !stock_level || !shop_id) {
        return res.status(400).json({ message: 'Missing required product fields.' });
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      unit,
      stock_level: Number(stock_level),
      category,
      mfgDate: mfgDate || null,
      expDate: expDate || null,
      shop_id,
      // If a file was uploaded, save its path. Otherwise, save null.
      imageUrl: req.file ? req.file.path : null
    });

    try {
      await newProduct.save();
      res.status(201).json({ message: 'Product added successfully!' });
    } catch (error) {
      res.status(400).json({ message: 'Error saving product.', error: error.message });
    }
  });
});

// POST: Update an existing product by its ID
// Endpoint: /api/products/update/:id
router.route('/update/:id').post((req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      // Update fields from the request body
      product.name = req.body.name;
      product.price = Number(req.body.price);
      product.unit = req.body.unit;
      product.stock_level = Number(req.body.stock_level);
      product.category = req.body.category;
      product.mfgDate = req.body.mfgDate || null;
      product.expDate = req.body.expDate || null;
      
      // If a new file was uploaded, update the image path
      if (req.file) {
        product.imageUrl = req.file.path;
      }

      await product.save();
      res.json({ message: 'Product updated successfully!' });
    } catch (error) {
      res.status(400).json({ message: 'Error updating product.', error: error.message });
    }
  });
});

// DELETE: Remove a product by its ID
// Endpoint: /api/products/:id
router.route('/:id').delete(async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product.', error: error.message });
  }
});

module.exports = router;
