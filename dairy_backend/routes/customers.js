const router = require('express').Router();
const Customer = require('../models/customer.model');

// --- API Routes for Customers ---

// POST: Add a new customer
// Endpoint: /api/customers/add
router.route('/add').post(async (req, res) => {
  const { name, email, phone, address, shop_id } = req.body;

  if (!name || !email || !phone || !shop_id) {
    return res.status(400).json({ message: 'Missing required customer fields.' });
  }

  const newCustomer = new Customer({
    name,
    email,
    phone,
    address,
    shop_id,
  });

  try {
    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully!' });
  } catch (error) {
    // This will catch errors, including the duplicate email-per-shop error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A customer with this email already exists for this shop.' });
    }
    res.status(400).json({ message: 'Error saving customer.', error: error.message });
  }
});

// POST: Update an existing customer by their ID
// Endpoint: /api/customers/update/:id
router.route('/update/:id').post(async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    // Update fields from the request body
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.phone = req.body.phone;
    customer.address = req.body.address;

    await customer.save();
    res.json({ message: 'Customer updated successfully!' });
  } catch (error) {
    if (error.code === 11000) {
        return res.status(400).json({ message: 'A customer with this email already exists for this shop.' });
    }
    res.status(400).json({ message: 'Error updating customer.', error: error.message });
  }
});

// DELETE: Remove a customer by their ID
// Endpoint: /api/customers/:id
router.route('/:id').delete(async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }
    res.json({ message: 'Customer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer.', error: error.message });
  }
});

module.exports = router;
