const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the structure for a "customer" document in the database
const customerSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required.'],
    trim: true,
  },
  email: {
    type: String,
    // **CHANGE:** Email is now optional
    required: false, 
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address.'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required.'],
    trim: true,
  },
  address: {
    // **CHANGE:** Address is now required
    type: String,
    required: [true, 'Address is required.'],
    trim: true,
  },
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  }
}, {
  timestamps: true,
});

// Create a compound index to ensure a customer's email is unique per shop, but only if it exists
customerSchema.index({ email: 1, shop_id: 1 }, { unique: true, partialFilterExpression: { email: { $type: "string" } } });

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
