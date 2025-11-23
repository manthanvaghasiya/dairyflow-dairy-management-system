const router = require('express').Router();
const Shop = require('../models/shop.model');
const Product = require('../models/product.model');
const Customer = require('../models/customer.model');

// --- API Routes for fetching Shop-specific data ---

// GET: Get a single shop's details by its ID
// Endpoint: /api/shops/:id
router.route('/:id').get(async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found.' });
    }
    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching shop details.', error: error.message });
  }
});

// GET: Get all products associated with a specific shop ID
// Endpoint: /api/shops/:id/products
router.route('/:id/products').get(async (req, res) => {
  try {
    const products = await Product.find({ shop_id: req.params.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching products for this shop.', error: error.message });
  }
});

// GET: Get all customers associated with a specific shop ID
// Endpoint: /api/shops/:id/customers
router.route('/:id/customers').get(async (req, res) => {
  try {
    const customers = await Customer.find({ shop_id: req.params.id });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching customers for this shop.', error: error.message });
  }
});


module.exports = router;
