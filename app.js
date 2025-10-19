// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');

// const { initDatabase } = require('./config/database');
// const { initRedis } = require('./config/redis');
// const { apiLimiter } = require('./middleware/rateLimit');
// const errorHandler = require('./middleware/errorHandler');

// // Import routes
// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');
// const cartRoutes = require('./routes/cart');
// const orderRoutes = require('./routes/orders');

// const app = express();

// // Initialize services
// initDatabase();
// initRedis();

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true
// }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));
// app.use('/api', apiLimiter);

// // Routes
// app.use('/api', authRoutes);
// app.use('/api', productRoutes);
// app.use('/api', cartRoutes);
// app.use('/api', orderRoutes);

// // Error handling
// app.use(errorHandler);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// module.exports = app;






// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const path = require('path');

// const { initDatabase } = require('./config/database');
// const { initRedis } = require('./config/redis');
// const { apiLimiter } = require('./middleware/rateLimit');
// const errorHandler = require('./middleware/errorHandler');
// const adsRoutes = require('./routes/ads');
// // Import routes
// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/products');
// const cartRoutes = require('./routes/cart');
// const orderRoutes = require('./routes/orders');

// const app = express();

// // Initialize services
// initDatabase();
// initRedis();
// // السماح لجميع النطاقات
// app.use(cors());
// // Middleware
// // app.use(cors({
// //   origin: process.env.CLIENT_URL || "http://localhost:3000",
// //   credentials: true
// // }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));
// app.use('/api', apiLimiter);

// // Routes
// app.use('/api', authRoutes);
// app.use('/api', productRoutes);
// app.use('/api', cartRoutes);
// app.use('/api', orderRoutes);
// app.use('/api/ads', adsRoutes);

// // Error handling
// app.use(errorHandler);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// module.exports = app;


// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const { initDatabase } = require('./config/database');
const { initRedis } = require('./config/redis');
const { apiLimiter } = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');
const adsRoutes = require('./routes/ads');
// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

// Initialize services
initDatabase();
initRedis();

// ✅ Middleware - تم إعداد خدمة الملفات الثابتة بشكل صحيح
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // ✅ محسن
app.use('/api', apiLimiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', productRoutes); // ✅ هذا الملف يحتوي على مسارات الفئات أيضاً
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api/ads', adsRoutes);

// Error handling
app.use(errorHandler);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;