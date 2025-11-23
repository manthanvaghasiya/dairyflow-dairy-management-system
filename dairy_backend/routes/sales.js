const router = require('express').Router();
const Sale = require('../models/sales.model');
const Product = require('../models/product.model');
const mongoose = require('mongoose');

// --- API Routes for Sales ---

// POST: Add a new sale
// Endpoint: /api/sales/add
router.route('/add').post(async (req, res) => {
  const { shop_id, customer_id, items, total_price, sale_type, payment_status, payment_method } = req.body;

  if (!shop_id || !items || !total_price || !sale_type) {
    return res.status(400).json({ message: 'Missing required sale fields.' });
  }
  if (sale_type === 'tab' && !customer_id) {
    return res.status(400).json({ message: 'Customer ID is required for tab sales.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newSale = new Sale({
      shop_id,
      customer_id: customer_id || null,
      items,
      total_price,
      sale_type,
      payment_status,
      payment_method,
    });
    await newSale.save({ session });

    for (const item of items) {
      const product = await Product.findById(item.product_id).session(session);
      if (!product) throw new Error(`Product with ID ${item.product_id} not found.`);
      if (product.stock_level < item.quantity) {
        throw new Error(`Not enough stock for ${product.name}.`);
      }
      product.stock_level -= item.quantity;
      await product.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json({ message: 'Sale recorded successfully!' });

  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: 'Error recording sale.', error: error.message });
  } finally {
    session.endSession();
  }
});

// **FIX:** The route is now '/shop/:shop_id' to match the frontend request
// GET: Get all sales for a specific shop
// Endpoint: /api/sales/shop/:shop_id
router.route('/shop/:shop_id').get(async (req, res) => {
    try {
        const sales = await Sale.find({ shop_id: req.params.shop_id })
            .populate('customer_id', 'name')
            .sort({ createdAt: -1 });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales reports.', error: error.message });
    }
});

// --- ROUTES FOR DEBT MANAGEMENT ---

// GET: Get all unpaid sales for a specific customer
// Endpoint: /api/sales/debt/:customer_id
router.route('/debt/:customer_id').get(async (req, res) => {
    try {
        const unpaidSales = await Sale.find({ 
            customer_id: req.params.customer_id,
            payment_status: 'unpaid' 
        }).sort({ createdAt: 1 });
        res.json(unpaidSales);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer debt.', error: error.message });
    }
});

// POST: Mark a specific sale as paid
// Endpoint: /api/sales/pay/:sale_id
router.route('/pay/:sale_id').post(async (req, res) => {
    const { payment_method } = req.body;
    if (!payment_method || !['cash', 'online'].includes(payment_method)) {
        return res.status(400).json({ message: 'A valid payment method (cash or online) is required.' });
    }
    try {
        const sale = await Sale.findById(req.params.sale_id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found.' });
        }
        if (sale.payment_status === 'paid') {
            return res.status(400).json({ message: 'This sale has already been paid.' });
        }

        sale.payment_status = 'paid';
        sale.payment_method = payment_method;
        await sale.save();

        res.json({ message: 'Payment recorded successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording payment.', error: error.message });
    }
});

module.exports = router;
