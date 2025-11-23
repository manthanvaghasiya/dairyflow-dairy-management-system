const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Define the structure for a "product" document in the database
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required.'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required.'],
    min: [0, 'Price cannot be negative.']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required.'],
    // The unit must be one of the values in this array
    enum: ['Litre', '500ml', 'Packet', 'kg', '500g']
  },
  stock_level: {
    type: Number,
    required: [true, 'Stock level is required.'],
    min: [0, 'Stock level cannot be negative.'],
    // Ensure stock is a whole number
    validate: {
      validator: Number.isInteger,
      message: '{VALUE} is not an integer value for stock.'
    }
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized' // Provide a default category
  },
  mfgDate: {
    type: Date
  },
  expDate: {
    type: Date
  },
  imageUrl: {
    type: String // This will store the path to the product's uploaded image
  },
  // This creates a direct link between a product and the shop it belongs to
  shop_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop', // This refers to the 'Shop' model
    required: true,
  }
}, {
  timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' fields
});

// Create the Product model from the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
