const router = require('express').Router();
const User = require('../models/user.model');
const Shop = require('../models/shop.model');
const bcrypt = require('bcrypt');

router.route('/register').post(async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      shop_name,
      address,
      phone
    } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    const newShop = new Shop({
      owner_id: savedUser._id,
      shop_name: shop_name,
      address: address,
      email: email,
      phone: phone
    });
    await newShop.save();

    res.status(201).json({ message: "Registration successful! Please login." });

  } catch (error) {
    console.error("Registration Error:", error); 
    res.status(500).json({ message: "Server error during registration." });
  }
});

router.route('/login').post(async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: "Invalid email or password." }); }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: "Invalid email or password." }); }
        const shop = await Shop.findOne({ owner_id: user._id });
        if (!shop) { return res.status(404).json({ message: "Could not find a shop associated with this user." }); }
        res.json({ message: "Login successful!", user: user, shop: shop });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

// --- THIS IS THE FIX ---
// Changed module.s to module.exports
module.exports = router;
// --- END OF FIX ---
