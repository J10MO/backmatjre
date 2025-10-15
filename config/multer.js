// const multer = require('multer');
// const path = require('path');
// const fs = require('fs').promises;

// // File upload configuration
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadPath = 'uploads/products';
//     await fs.mkdir(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|webp/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);
//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'));
//     }
//   }
// });

// module.exports = upload;



// // config/multer.js
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // إنشاء مجلد التحميلات إذا لم يكن موجوداً
// const uploadsDir = path.join(__dirname, '../uploads/products');
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadsDir);
//   },
//   filename: function (req, file, cb) {
//     // إنشاء اسم فريد للملف
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'product-' + uniqueSuffix + ext);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   // التحقق من نوع الملف
//   if (file.mimetype.startsWith('image/')) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB limit
//   }
// });

// module.exports = upload;




const multer = require('multer');
const path = require('path');
const fs = require('fs');

// إنشاء مجلدات التحميلات إذا لم تكن موجودة
const createUploadsDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// مجلدات مختلفة للملفات
const productsDir = path.join(__dirname, '../uploads/products');
const categoriesDir = path.join(__dirname, '../uploads/categories');
const adsDir = path.join(__dirname, '../uploads/ads');

// إنشاء المجلدات
createUploadsDir(productsDir);
createUploadsDir(categoriesDir);
createUploadsDir(adsDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = productsDir; // الافتراضي
    
    // تحديد مجلد الوجهة بناءً على نوع الطلب
    if (req.originalUrl.includes('/categories')) {
      uploadPath = categoriesDir;
    } else if (req.originalUrl.includes('/ads')) {
      uploadPath = adsDir;
    } else if (req.originalUrl.includes('/products')) {
      uploadPath = productsDir;
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // إنشاء اسم فريد للملف
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    
    let prefix = 'file';
    if (req.originalUrl.includes('/categories')) {
      prefix = 'category';
    } else if (req.originalUrl.includes('/ads')) {
      prefix = 'ad';
    } else if (req.originalUrl.includes('/products')) {
      prefix = 'product';
    }
    
    cb(null, prefix + '-' + uniqueSuffix + ext);
  }
});

// ✅ إصلاح fileFilter
const fileFilter = (req, file, cb) => {
  // التحقق من نوع الملف
  const allowedMimes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'image/gif'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // ✅ استخدام new Error بدلاً من throw
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP and GIF images are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// ✅ معالج الأخطاء لـ multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'حجم الملف كبير جداً. الحد الأقصى 5MB'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected field',
        message: 'حقل غير متوقع'
      });
    }
  } else if (err) {
    return res.status(400).json({
      error: 'File upload error',
      message: err.message
    });
  }
  next();
};

module.exports = { upload, handleMulterError };