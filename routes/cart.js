const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateJWT } = require('../middleware/auth');

router.get('/cart', authenticateJWT, cartController.getCart);
router.post('/cart', authenticateJWT, cartController.addToCart);
router.put('/cart/:product_id', authenticateJWT, cartController.updateCartItem);
router.delete('/cart/:product_id', authenticateJWT, cartController.removeFromCart);
router.delete('/cart', authenticateJWT, cartController.clearCart);

module.exports = router;