// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// const { authenticateJWT } = require('../middleware/auth');

// router.post('/orders', authenticateJWT, orderController.createOrder);
// router.get('/orders', authenticateJWT, orderController.getOrders);

// module.exports = router;






// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// const { authenticateJWT, isAdmin } = require('../middleware/auth');

// // Regular user routes
// router.post('/orders', authenticateJWT, orderController.createOrder);
// router.get('/orders', authenticateJWT, orderController.getOrders);
// router.get('/orders/:orderId', authenticateJWT, orderController.getOrderById);

// // Admin only routes
// router.put('/admin/orders/:orderId/status', authenticateJWT, isAdmin, orderController.updateOrderStatus);
// router.put('/admin/orders/:orderId', authenticateJWT, isAdmin, orderController.updateOrder);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const orderController = require('../controllers/orderController');
// const { authenticateJWT, isAdmin } = require('../middleware/auth');

// // Regular user routes
// router.post('/orders', authenticateJWT, orderController.createOrder);
// router.get('/orders', authenticateJWT, orderController.getOrders);
// router.get('/orders/:orderId', authenticateJWT, orderController.getOrderById);

// // Admin only routes - FIXED: Using PUT method
// router.put('/admin/orders/:orderId/status', authenticateJWT, isAdmin, orderController.updateOrderStatus);
// router.put('/admin/orders/:orderId', authenticateJWT, isAdmin, orderController.updateOrder);

// module.exports = router;







const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

// Regular user routes
router.post('/orders', authenticateJWT, orderController.createOrder);
router.get('/orders', authenticateJWT, orderController.getOrders);
router.get('/orders/:orderId', authenticateJWT, orderController.getOrderById);

// Admin only routes
router.put('/admin/orders/:orderId/status', authenticateJWT, isAdmin, orderController.updateOrderStatus);
router.put('/admin/orders/:orderId', authenticateJWT, isAdmin, orderController.updateOrder);

module.exports = router;