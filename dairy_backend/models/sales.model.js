const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const saleItemSchema = new Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const saleSchema = new Schema({
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null,
  },
  items: {
    type: [saleItemSchema],
    required: true,
    validate: [v => Array.isArray(v) && v.length > 0, 'A sale must have at least one item.'],
  },
  total_price: {
    type: Number,
    required: true,
    min: 0,
  },
  sale_type: {
    type: String,
    required: true,
    enum: ['cash', 'tab'],
  },
  // --- NEW FEATURES FOR DEBT TRACKING ---
  payment_status: {
    type: String,
    required: true,
    enum: ['paid', 'unpaid'],
    default: 'paid', // By default, a sale is considered paid
  },
  payment_method: {
    type: String,
    enum: ['cash', 'online', 'none'], // 'none' for unpaid tab sales
    default: 'cash',
  },
}, {
  timestamps: true,
});

// When a 'cash' sale is saved, ensure its status is always 'paid'
saleSchema.pre('save', function(next) {
  if (this.sale_type === 'cash') {
    this.payment_status = 'paid';
    if (this.payment_method === 'none') {
        this.payment_method = 'cash'; // Default cash sales to cash payment
    }
  }
  // If it's a tab sale and it's unpaid, the method should be 'none'
  if (this.sale_type === 'tab' && this.payment_status === 'unpaid') {
      this.payment_method = 'none';
  }
  next();
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;
