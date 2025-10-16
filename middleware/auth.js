// const jwt = require('jsonwebtoken');

// function authenticateJWT(req, res, next) {
//   const token = req.header('Authorization')?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access Denied' });

//   jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
//     if (err) return res.status(403).json({ message: 'Invalid Token' });
//     req.user = user;
//     next();
//   });
// }

// function isAdmin(req, res, next) {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// }

// module.exports = { authenticateJWT, isAdmin };


// const jwt = require('jsonwebtoken');

// function authenticateJWT(req, res, next) {
//   const authHeader = req.header('Authorization');
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false,
//       message: 'Access Denied. No token provided.' 
//     });
//   }

//   // Handle both "Bearer token" and just "token" formats
//   const token = authHeader.startsWith('Bearer ') 
//     ? authHeader.split(' ')[1] 
//     : authHeader;

//   if (!token) {
//     return res.status(401).json({ 
//       success: false,
//       message: 'Access Denied. Invalid token format.' 
//     });
//   }

//   jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
//     if (err) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Invalid or expired token' 
//       });
//     }
//     req.user = user;
//     next();
//   });
// }

// function isAdmin(req, res, next) {
//   if (!req.user) {
//     return res.status(401).json({ 
//       success: false,
//       message: 'Authentication required' 
//     });
//   }

//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ 
//       success: false,
//       message: 'Admin access required' 
//     });
//   }
//   next();
// }

// // Optional: Check if user is authenticated (without requiring admin)
// function isAuthenticated(req, res, next) {
//   const authHeader = req.header('Authorization');
  
//   if (!authHeader) {
//     req.user = null;
//     return next();
//   }

//   const token = authHeader.startsWith('Bearer ') 
//     ? authHeader.split(' ')[1] 
//     : authHeader;

//   if (!token) {
//     req.user = null;
//     return next();
//   }

//   jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
//     if (err) {
//       req.user = null;
//     } else {
//       req.user = user;
//     }
//     next();
//   });
// }

// module.exports = { 
//   authenticateJWT, 
//   isAdmin, 
//   isAuthenticated 
// };





// const jwt = require('jsonwebtoken');

// function authenticateJWT(req, res, next) {
//   const authHeader = req.header('Authorization');
  
//   if (!authHeader) {
//     return res.status(401).json({ 
//       success: false,
//       message: 'Access Denied. No token provided.' 
//     });
//   }

//   const token = authHeader.startsWith('Bearer ') 
//     ? authHeader.split(' ')[1] 
//     : authHeader;

//   if (!token) {
//     return res.status(401).json({ 
//       success: false,
//       message: 'Access Denied. Invalid token format.' 
//     });
//   }

//   jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
//     if (err) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Invalid or expired token' 
//       });
//     }
//     req.user = user;
//     next();
//   });
// }

// function isAdmin(req, res, next) {
//   if (!req.user) {
//     return res.status(401).json({ 
//       success: false,
//       message: 'Authentication required' 
//     });
//   }

//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ 
//       success: false,
//       message: 'Admin access required' 
//     });
//   }
//   next();
// }

// // Middleware للتحقق من الأدوار المتعددة
// function requireRole(roles) {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ 
//         success: false,
//         message: 'Authentication required' 
//       });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ 
//         success: false,
//         message: 'Insufficient permissions' 
//       });
//     }
//     next();
//   };
// }

// module.exports = { 
//   authenticateJWT, 
//   isAdmin, 
//   requireRole 
// };



const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ 
      success: false,
      message: 'Access Denied. No token provided.',
      message_ar: 'تم رفض الوصول. لم يتم تقديم رمز الدخول.'
    });
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access Denied. Invalid token format.',
      message_ar: 'تم رفض الوصول. تنسيق رمز الدخول غير صالح.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired token',
        message_ar: 'رمز الدخول غير صالح أو منتهي الصلاحية'
      });
    }
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false,
      message: 'Authentication required',
      message_ar: 'مطلوب مصادقة'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false,
      message: 'Admin access required',
      message_ar: 'مطلوب صلاحيات مدير'
    });
  }
  next();
}

// Middleware للتحقق من الأدوار المتعددة
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        message_ar: 'مطلوب مصادقة'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        message: 'Insufficient permissions',
        message_ar: 'صلاحيات غير كافية'
      });
    }
    next();
  };
}

// Middleware للتحقق من أن المستخدم هو نفسه أو مدير
function isOwnerOrAdmin(paramName = 'id') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        message_ar: 'مطلوب مصادقة'
      });
    }

    const resourceId = req.params[paramName] || req.body.userId;
    
    if (req.user.role === 'admin' || req.user.id.toString() === resourceId.toString()) {
      return next();
    }

    return res.status(403).json({ 
      success: false,
      message: 'Access denied to this resource',
      message_ar: 'تم رفض الوصول إلى هذا المورد'
    });
  };
}

module.exports = { 
  authenticateJWT, 
  isAdmin, 
  requireRole,
  isOwnerOrAdmin
};