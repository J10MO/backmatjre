// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const categoryController = require('../controllers/categoryController');
// const { authenticateJWT, isAdmin } = require('../middleware/auth');
// const upload = require('../config/multer');

// // ✅ Public routes - Products
// router.get('/products', productController.getProducts);
// router.get('/products/featured', productController.getFeaturedProducts);
// router.get('/products/sale', productController.getProductsOnSale);
// router.get('/products/search', productController.searchProducts);
// router.get('/products/:id', productController.getProduct);

// // ✅ Public routes - Categories
// router.get('/categories', categoryController.getCategories);
// router.get('/categories/:id', categoryController.getCategory);
// router.get('/categories/:id/products', categoryController.getCategoryProducts);

// // ✅ Admin routes - Products
// router.post('/products', authenticateJWT, isAdmin, upload.single('image'), productController.createProduct);
// router.put('/products/:id', authenticateJWT, isAdmin, upload.single('image'), productController.updateProduct);
// router.delete('/products/:id', authenticateJWT, isAdmin, productController.deleteProduct);

// // ✅ Admin routes - Categories
// router.post('/categories', authenticateJWT, isAdmin, categoryController.createCategory);
// router.put('/categories/:id', authenticateJWT, isAdmin, categoryController.updateCategory);
// router.delete('/categories/:id', authenticateJWT, isAdmin, categoryController.deleteCategory);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const categoryController = require('../controllers/categoryController');
// const { authenticateJWT, isAdmin } = require('../middleware/auth');
// const upload = require('../config/multer');

// // ✅ Public routes - Products
// router.get('/products', productController.getProducts);
// router.get('/products/featured', productController.getFeaturedProducts);
// router.get('/products/sale', productController.getProductsOnSale);
// router.get('/products/search', productController.searchProducts);
// router.get('/products/:id', productController.getProduct);

// // ✅ Public routes - Categories
// router.get('/categories', categoryController.getCategories);
// router.get('/categories/:id', categoryController.getCategory);
// router.get('/categories/:id/products', categoryController.getCategoryProducts);

// // ✅ Admin routes - Products
// router.post('/products', authenticateJWT, isAdmin, upload.single('image'), productController.createProduct);
// router.put('/products/:id', authenticateJWT, isAdmin, upload.single('image'), productController.updateProduct);
// router.delete('/products/:id', authenticateJWT, isAdmin, productController.deleteProduct);

// // ✅ Admin routes - Categories
// router.post('/categories', authenticateJWT, isAdmin, categoryController.createCategory);
// router.put('/categories/:id', authenticateJWT, isAdmin, categoryController.updateCategory);
// router.delete('/categories/:id', authenticateJWT, isAdmin, categoryController.deleteCategory);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const categoryController = require('../controllers/categoryController');
// const { authenticateJWT, isAdmin } = require('../middleware/auth');
// const { upload, handleMulterError } = require('../config/multer'); // ✅ استيراد معالج الأخطاء

// // ✅ Public routes - Products
// router.get('/products', productController.getProducts);
// router.get('/products/featured', productController.getFeaturedProducts);
// router.get('/products/sale', productController.getProductsOnSale);
// router.get('/products/search', productController.searchProducts);
// router.get('/products/:id', productController.getProduct);

// // ✅ Public routes - Categories
// router.get('/categories', categoryController.getCategories);
// router.get('/categories/:id', categoryController.getCategory);
// router.get('/categories/:id/products', categoryController.getCategoryProducts);

// // ✅ Admin routes - Products
// router.post('/products', authenticateJWT, isAdmin, upload.single('image'), handleMulterError, productController.createProduct);
// router.put('/products/:id', authenticateJWT, isAdmin, upload.single('image'), handleMulterError, productController.updateProduct);
// router.delete('/products/:id', authenticateJWT, isAdmin, productController.deleteProduct);

// // ✅ Admin routes - Categories
// router.post('/categories', authenticateJWT, isAdmin, upload.single('image'), handleMulterError, categoryController.createCategory);
// router.put('/categories/:id', authenticateJWT, isAdmin, upload.single('image'), handleMulterError, categoryController.updateCategory);
// router.delete('/categories/:id', authenticateJWT, isAdmin, categoryController.deleteCategory);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const categoryController = require('../controllers/categoryController');
// const { authenticateJWT, isAdmin } = require('../middleware/auth');

// // ✅ إزالة استيراد multer حيث لن نستخدم رفع الملفات
// // ❌ إزالة هذا السطر: const { upload, handleMulterError } = require('../config/multer');

// // ✅ Public routes - Products
// router.get('/products', productController.getProducts);
// router.get('/products/featured', productController.getFeaturedProducts);
// router.get('/products/sale', productController.getProductsOnSale);
// router.get('/products/search', productController.searchProducts);
// router.get('/products/:id', productController.getProduct);

// // ✅ Public routes - Categories
// router.get('/categories', categoryController.getCategories);
// router.get('/categories/:id', categoryController.getCategory);
// router.get('/categories/:id/products', categoryController.getCategoryProducts);

// // ✅ Admin routes - Products (بدون multer)
// router.post('/products', authenticateJWT, isAdmin, productController.createProduct);
// router.put('/products/:id', authenticateJWT, isAdmin, productController.updateProduct);
// router.delete('/products/:id', authenticateJWT, isAdmin, productController.deleteProduct);

// // ✅ Admin routes - Categories (بدون multer)
// router.post('/categories', authenticateJWT, isAdmin, categoryController.createCategory);
// router.put('/categories/:id', authenticateJWT, isAdmin, categoryController.updateCategory);
// router.delete('/categories/:id', authenticateJWT, isAdmin, categoryController.deleteCategory);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const categoryController = require('../controllers/categoryController');
// const { authenticateJWT, isAdmin } = require('../middleware/auth');




// // ✅ Public routes - Products
// router.get('/products', productController.getProducts);
// router.get('/products/featured', productController.getFeaturedProducts);
// router.get('/products/sale', productController.getProductsOnSale);
// router.get('/products/search', productController.searchProducts);
// router.get('/products/category/:categoryId', productController.getProductsByCategory);
// router.get('/products/:id', productController.getProduct);

// // ✅ Public routes - Categories
// router.get('/categories', categoryController.getCategories);
// router.get('/categories/:id', categoryController.getCategory);
// router.get('/categories/:id/products', categoryController.getCategoryProducts);

// // ✅ Admin routes - Products
// router.post('/products', authenticateJWT, isAdmin, productController.createProduct);
// router.put('/products/:id', authenticateJWT, isAdmin, productController.updateProduct);
// router.delete('/products/:id', authenticateJWT, isAdmin, productController.deleteProduct);

// // ✅ Admin routes - Categories
// router.post('/categories', authenticateJWT, isAdmin, categoryController.createCategory);
// router.put('/categories/:id', authenticateJWT, isAdmin, categoryController.updateCategory);
// router.delete('/categories/:id', authenticateJWT, isAdmin, categoryController.deleteCategory);

// module.exports = router;





// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const categoryController = require('../controllers/categoryController');
// const favoriteController = require('../controllers/favoriteController'); // أضف هذا
// const { authenticateJWT, isAdmin } = require('../middleware/auth');

// // ✅ Public routes - Products
// router.get('/products', productController.getProducts);
// router.get('/products/featured', productController.getFeaturedProducts);
// router.get('/products/sale', productController.getProductsOnSale);
// router.get('/products/search', productController.searchProducts);
// router.get('/products/category/:categoryId', productController.getProductsByCategory);
// router.get('/products/:id', productController.getProduct);

// // ✅ Public routes - Categories
// router.get('/categories', categoryController.getCategories);
// router.get('/categories/:id', categoryController.getCategory);
// router.get('/categories/:id/products', categoryController.getCategoryProducts);

// // ✅ Favorite routes (تتطلب مصادقة)
// router.post('/favorites/:productId', authenticateJWT, favoriteController.addToFavorites);
// router.delete('/favorites/:productId', authenticateJWT, favoriteController.removeFromFavorites);
// router.get('/favorites', authenticateJWT, favoriteController.getFavorites);
// router.get('/favorites/check/:productId', authenticateJWT, favoriteController.checkFavorite);
// router.get('/favorites/count', authenticateJWT, favoriteController.getFavoritesCount);

// // ✅ Admin routes - Products
// router.post('/products', authenticateJWT, isAdmin, productController.createProduct);
// router.put('/products/:id', authenticateJWT, isAdmin, productController.updateProduct);
// router.delete('/products/:id', authenticateJWT, isAdmin, productController.deleteProduct);

// // ✅ Admin routes - Categories
// router.post('/categories', authenticateJWT, isAdmin, categoryController.createCategory);
// router.put('/categories/:id', authenticateJWT, isAdmin, categoryController.updateCategory);
// router.delete('/categories/:id', authenticateJWT, isAdmin, categoryController.deleteCategory);

// module.exports = router;



const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")
const categoryController = require("../controllers/categoryController")
const favoriteController = require("../controllers/favoriteController")
const { authenticateJWT, isAdmin } = require("../middleware/auth")

// ✅ Public routes - Products (NO authentication required)
router.get("/products", productController.getProducts)
router.get("/products/featured", productController.getFeaturedProducts)
router.get("/products/sale", productController.getProductsOnSale)
router.get("/products/search", productController.searchProducts)
router.get("/products/category/:categoryId", productController.getProductsByCategory)
router.get("/products/:id", productController.getProduct)

// ✅ Public routes - Categories (NO authentication required)
router.get("/categories", categoryController.getCategories)
router.get("/categories/:id", categoryController.getCategory)
router.get("/categories/:id/products", categoryController.getCategoryProducts)

// ✅ Protected routes - Favorites (authentication required)
router.post("/favorites/:productId", authenticateJWT, favoriteController.addToFavorites)
router.delete("/favorites/:productId", authenticateJWT, favoriteController.removeFromFavorites)
router.get("/favorites", authenticateJWT, favoriteController.getFavorites)
router.get("/favorites/check/:productId", authenticateJWT, favoriteController.checkFavorite)
router.get("/favorites/count", authenticateJWT, favoriteController.getFavoritesCount)

// ✅ Admin routes - Products (authentication + admin role required)
router.post("/products", authenticateJWT, isAdmin, productController.createProduct)
router.put("/products/:id", authenticateJWT, isAdmin, productController.updateProduct)
router.delete("/products/:id", authenticateJWT, isAdmin, productController.deleteProduct)

// ✅ Admin routes - Categories (authentication + admin role required)
router.post("/categories", authenticateJWT, isAdmin, categoryController.createCategory)
router.put("/categories/:id", authenticateJWT, isAdmin, categoryController.updateCategory)
router.delete("/categories/:id", authenticateJWT, isAdmin, categoryController.deleteCategory)

module.exports = router
