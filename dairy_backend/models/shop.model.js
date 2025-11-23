const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema({
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This links the shop to a user
        required: true
    },
    shop_name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    // --- THIS IS THE FIX ---
    // The email should be both required and unique to prevent errors.
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // --- END OF FIX ---
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
