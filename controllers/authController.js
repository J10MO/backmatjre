// const { pool } = require('../config/database');
// const jwt = require('jsonwebtoken');

// function generateToken(user) {
//   return jwt.sign(
//     { id: user.id, phone: user.phone, role: user.role },
//     process.env.JWT_SECRET || 'your-secret-key',
//     { expiresIn: '7d' }
//   );
// }

// function generateVerificationCode() {
//   return Math.floor(1000 + Math.random() * 9000).toString();
// }

// const authController = {
//   // Check if phone exists
//   async checkPhone(req, res) {
//     const { phone } = req.body;
    
//     try {
//       const result = await pool.query('SELECT id, is_verified FROM users WHERE phone = $1', [phone]);
      
//       if (result.rows.length > 0) {
//         const verificationCode = generateVerificationCode();
//         await pool.query(
//           'UPDATE users SET verification_code = $1 WHERE phone = $2',
//           [verificationCode, phone]
//         );
        
//         console.log(`Verification code for ${phone}: ${verificationCode}`);
        
//         res.json({ 
//           exists: true, 
//           isVerified: result.rows[0].is_verified,
//           message: 'Verification code sent'
//         });
//       } else {
//         res.json({ exists: false });
//       }
//     } catch (err) {
//       console.error('Error checking phone:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Register new user
//   async register(req, res) {
//     const { name, phone, email, address } = req.body;
    
//     try {
//       const verificationCode = generateVerificationCode();
      
//       const result = await pool.query(
//         `INSERT INTO users (name, phone, email, verification_code, address_street, address_city, address_district, address_postal_code)
//          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
//         [name, phone, email, verificationCode, address?.street, address?.city, address?.district, address?.postalCode]
//       );
      
//       const user = result.rows[0];
      
//       console.log(`Verification code for ${phone}: ${verificationCode}`);
      
//       res.json({ 
//         message: 'User registered successfully',
//         userId: user.id,
//         verificationRequired: true
//       });
//     } catch (err) {
//       console.error('Error registering user:', err);
//       if (err.code === '23505') {
//         res.status(400).json({ error: 'Phone number already exists' });
//       } else {
//         res.status(500).json({ error: 'Server error' });
//       }
//     }
//   },

//   // Verify code and login
//   async verify(req, res) {
//     const { phone, code } = req.body;
    
//     try {
//       const result = await pool.query(
//         'SELECT * FROM users WHERE phone = $1 AND verification_code = $2',
//         [phone, code]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(400).json({ error: 'Invalid verification code' });
//       }
      
//       const user = result.rows[0];
      
//       await pool.query(
//         'UPDATE users SET is_verified = true, verification_code = NULL WHERE id = $1',
//         [user.id]
//       );
      
//       const token = generateToken(user);
      
//       res.json({
//         token,
//         user: {
//           id: user.id,
//           name: user.name,
//           phone: user.phone,
//           email: user.email,
//           role: user.role,
//           membershipLevel: user.membership_level,
//           points: user.points,
//           totalOrders: user.total_orders,
//           address: {
//             street: user.address_street,
//             city: user.address_city,
//             district: user.address_district,
//             postalCode: user.address_postal_code
//           }
//         }
//       });
//     } catch (err) {
//       console.error('Error verifying code:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = authController;







// const { pool } = require('../config/database');
// const jwt = require('jsonwebtoken');

// function generateToken(user) {
//   return jwt.sign(
//     { id: user.id, phone: user.phone, role: user.role },
//     process.env.JWT_SECRET || 'your-secret-key',
//     { expiresIn: '7d' }
//   );
// }

// const authController = {
//   // Check phone and login/register in one step
//   async handlePhone(req, res) {
//     const { phone, name, email, address } = req.body;
    
//     if (!phone) {
//       return res.status(400).json({ 
//         error: 'Phone number is required',
//         message: 'رقم الهاتف مطلوب'
//       });
//     }

//     try {
//       // Check if user exists
//       const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
      
//       if (result.rows.length > 0) {
//         // User exists - login directly
//         const user = result.rows[0];
//         const token = generateToken(user);
        
//         res.json({ 
//           action: 'login',
//           message: 'تم تسجيل الدخول بنجاح',
//           token,
//           user: {
//             id: user.id,
//             name: user.name,
//             phone: user.phone,
//             email: user.email,
//             role: user.role,
//             membershipLevel: user.membership_level,
//             points: user.points,
//             totalOrders: user.total_orders,
//             address: {
//               street: user.address_street,
//               city: user.address_city,
//               district: user.address_district,
//               postalCode: user.address_postal_code
//             }
//           }
//         });
//       } else {
//         // User doesn't exist - register new user
//         if (!name) {
//           return res.status(400).json({ 
//             action: 'register_required',
//             error: 'Name is required for registration',
//             message: 'الاسم مطلوب للتسجيل'
//           });
//         }

//         const newUserResult = await pool.query(
//           `INSERT INTO users (name, phone, email, address_street, address_city, address_district, address_postal_code)
//            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//           [name, phone, email || null, address?.street, address?.city, address?.district, address?.postalCode]
//         );
        
//         const newUser = newUserResult.rows[0];
//         const token = generateToken(newUser);
        
//         res.status(201).json({ 
//           action: 'register',
//           message: 'تم التسجيل بنجاح',
//           token,
//           user: {
//             id: newUser.id,
//             name: newUser.name,
//             phone: newUser.phone,
//             email: newUser.email,
//             role: newUser.role,
//             membershipLevel: newUser.membership_level,
//             points: newUser.points,
//             totalOrders: newUser.total_orders,
//             address: {
//               street: newUser.address_street,
//               city: newUser.address_city,
//               district: newUser.address_district,
//               postalCode: newUser.address_postal_code
//             }
//           }
//         });
//       }
//     } catch (err) {
//       console.error('Error in handlePhone:', err);
//       if (err.code === '23505') {
//         res.status(400).json({ 
//           error: 'Phone number already exists',
//           message: 'رقم الهاتف مسجل مسبقاً'
//         });
//       } else {
//         res.status(500).json({ error: 'Server error' });
//       }
//     }
//   },

//   // Simple phone login
//   async login(req, res) {
//     const { phone } = req.body;
    
//     if (!phone) {
//       return res.status(400).json({ 
//         error: 'Phone number is required',
//         message: 'رقم الهاتف مطلوب'
//       });
//     }

//     try {
//       const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ 
//           error: 'User not found',
//           message: 'لم يتم العثور على مستخدم بهذا الرقم'
//         });
//       }
      
//       const user = result.rows[0];
//       const token = generateToken(user);
      
//       res.json({
//         message: 'تم تسجيل الدخول بنجاح',
//         token,
//         user: {
//           id: user.id,
//           name: user.name,
//           phone: user.phone,
//           email: user.email,
//           role: user.role,
//           membershipLevel: user.membership_level,
//           points: user.points,
//           totalOrders: user.total_orders,
//           address: {
//             street: user.address_street,
//             city: user.address_city,
//             district: user.address_district,
//             postalCode: user.address_postal_code
//           }
//         }
//       });
//     } catch (err) {
//       console.error('Error in login:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Register new user
//   async register(req, res) {
//     const { name, phone, email, address } = req.body;
    
//     if (!name || !phone) {
//       return res.status(400).json({ 
//         error: 'Name and phone are required',
//         message: 'الاسم ورقم الهاتف مطلوبان'
//       });
//     }

//     try {
//       // Check if phone already exists
//       const existingUser = await pool.query('SELECT id FROM users WHERE phone = $1', [phone]);
//       if (existingUser.rows.length > 0) {
//         return res.status(400).json({ 
//           error: 'Phone number already registered',
//           message: 'رقم الهاتف مسجل مسبقاً'
//         });
//       }

//       const result = await pool.query(
//         `INSERT INTO users (name, phone, email, address_street, address_city, address_district, address_postal_code)
//          VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//         [name, phone, email || null, address?.street, address?.city, address?.district, address?.postalCode]
//       );
      
//       const user = result.rows[0];
//       const token = generateToken(user);
      
//       res.status(201).json({
//         message: 'تم التسجيل بنجاح',
//         token,
//         user: {
//           id: user.id,
//           name: user.name,
//           phone: user.phone,
//           email: user.email,
//           role: user.role,
//           membershipLevel: user.membership_level,
//           points: user.points,
//           totalOrders: user.total_orders,
//           address: {
//             street: user.address_street,
//             city: user.address_city,
//             district: user.address_district,
//             postalCode: user.address_postal_code
//           }
//         }
//       });
//     } catch (err) {
//       console.error('Error in register:', err);
//       if (err.code === '23505') {
//         res.status(400).json({ 
//           error: 'Phone number already exists',
//           message: 'رقم الهاتف مسجل مسبقاً'
//         });
//       } else {
//         res.status(500).json({ error: 'Server error' });
//       }
//     }
//   },

//   // Get user profile
//   async getProfile(req, res) {
//     try {
//       const result = await pool.query(
//         'SELECT id, name, phone, email, role, membership_level, points, total_orders, address_street, address_city, address_district, address_postal_code, created_at FROM users WHERE id = $1',
//         [req.user.id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }
      
//       const user = result.rows[0];
      
//       res.json({
//         id: user.id,
//         name: user.name,
//         phone: user.phone,
//         email: user.email,
//         role: user.role,
//         membershipLevel: user.membership_level,
//         points: user.points,
//         totalOrders: user.total_orders,
//         address: {
//           street: user.address_street,
//           city: user.address_city,
//           district: user.address_district,
//           postalCode: user.address_postal_code
//         },
//         createdAt: user.created_at
//       });
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Update user profile
//   async updateProfile(req, res) {
//     const { name, email, address } = req.body;
    
//     try {
//       const result = await pool.query(
//         `UPDATE users 
//          SET name = COALESCE($1, name),
//              email = COALESCE($2, email),
//              address_street = COALESCE($3, address_street),
//              address_city = COALESCE($4, address_city),
//              address_district = COALESCE($5, address_district),
//              address_postal_code = COALESCE($6, address_postal_code),
//              updated_at = CURRENT_TIMESTAMP
//          WHERE id = $7
//          RETURNING id, name, phone, email, address_street, address_city, address_district, address_postal_code`,
//         [name, email, address?.street, address?.city, address?.district, address?.postalCode, req.user.id]
//       );
      
//       res.json({ 
//         message: 'تم تحديث الملف الشخصي بنجاح',
//         user: result.rows[0] 
//       });
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = authController;





const { pool } = require('../config/database');
const { generateToken, generateVerificationCode } = require('../utils/helpers');
const { getIO } = require('../utils/socket');

const authController = {
  // Send OTP to phone number
  async sendOTP(req, res) {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Basic phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    try {
      // Check if user exists
      const userResult = await pool.query(
        'SELECT id, name, is_verified FROM users WHERE phone = $1', 
        [phone]
      );
      
      const userExists = userResult.rows.length > 0;
      const verificationCode = generateVerificationCode();
      
      // Set expiration time (10 minutes from now)
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      if (userExists) {
        // Update existing user with new OTP
        await pool.query(
          'UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE phone = $3',
          [verificationCode, expiresAt, phone]
        );
      } else {
        // Create temporary unverified user
        await pool.query(
          `INSERT INTO users (phone, verification_code, code_expires_at, is_verified) 
           VALUES ($1, $2, $3, false)`,
          [phone, verificationCode, expiresAt]
        );
      }
      
      // TODO: Integrate with SMS service in production
      // For now, we'll log the OTP to console
      console.log(`📱 OTP for ${phone}: ${verificationCode} (Expires: ${expiresAt.toLocaleTimeString()})`);
      
      res.json({
        success: true,
        exists: userExists,
        message: 'OTP sent successfully',
        // Remove debugOtp in production - only for development
        debugOtp: process.env.NODE_ENV === 'development' ? verificationCode : undefined
      });
      
    } catch (err) {
      console.error('Error sending OTP:', err);
      
      if (err.code === '23505') {
        res.status(400).json({ error: 'Phone number already exists' });
      } else {
        res.status(500).json({ error: 'Failed to send OTP' });
      }
    }
  },

  // Verify OTP and login/register
async verifyOTP(req, res) {
  const { phone, code, userData } = req.body;
  
  console.log('🔍 Received userData:', userData); // Debug log

  if (!phone || !code) {
    return res.status(400).json({ error: 'Phone and OTP code are required' });
  }

  try {
    // Check if verification code is valid and not expired
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE phone = $1 AND verification_code = $2 
       AND code_expires_at > NOW()`,
      [phone, code]
    );
    
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    const user = result.rows[0];
    let finalUser = user;
    
    // If user is not verified yet and we have userData, complete registration
    if (!user.is_verified && userData) {
      console.log('📝 Completing registration with userData:', userData);
      
      const updateResult = await pool.query(
        `UPDATE users SET 
          name = $1, 
          email = $2, 
          address_street = $3, 
          address_city = $4, 
          address_district = $5, 
          address_postal_code = $6,
          is_verified = true,
          verification_code = NULL,
          code_expires_at = NULL,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [
          userData.name,
          userData.email,
          userData.address?.street || null,
          userData.address?.city || null,
          userData.address?.district || null,
          userData.address?.postalCode || null,
          user.id
        ]
      );
      finalUser = updateResult.rows[0];
    } else if (!user.is_verified) {
      // Mark as verified but don't update profile
      const updateResult = await pool.query(
        `UPDATE users SET 
          is_verified = true,
          verification_code = NULL,
          code_expires_at = NULL,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $1 RETURNING *`,
        [user.id]
      );
      finalUser = updateResult.rows[0];
    } else {
      // Clear OTP data for existing verified user
      await pool.query(
        'UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE id = $1',
        [user.id]
      );
    }
    
    // Generate JWT token
    const token = generateToken(finalUser);
    
    // Emit socket event if socket.io is available (with error handling)
    try {
      const io = getIO();
      if (io) {
        io.emit('user_logged_in', { 
          userId: finalUser.id, 
          name: finalUser.name || 'User',
          phone: finalUser.phone 
        });
      }
    } catch (socketError) {
      console.log('⚠️ Socket.io not available - continuing without socket emission');
    }
    
    res.json({
      success: true,
      token,
      user: {
        id: finalUser.id,
        name: finalUser.name,
        phone: finalUser.phone,
        email: finalUser.email,
        role: finalUser.role,
        membershipLevel: finalUser.membership_level,
        points: finalUser.points,
        totalOrders: finalUser.total_orders,
        isVerified: finalUser.is_verified,
        address: {
          street: finalUser.address_street,
          city: finalUser.address_city,
          district: finalUser.address_district,
          postalCode: finalUser.address_postal_code
        }
      }
    });
    
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
},

  // Resend OTP
  async resendOTP(req, res) {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
      // Check if user exists
      const userResult = await pool.query(
        'SELECT id FROM users WHERE phone = $1', 
        [phone]
      );
      
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Phone number not found' });
      }
      
      const verificationCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      
      await pool.query(
        'UPDATE users SET verification_code = $1, code_expires_at = $2 WHERE phone = $3',
        [verificationCode, expiresAt, phone]
      );
      
      // TODO: Integrate with SMS service
      console.log(`📱 Resent OTP for ${phone}: ${verificationCode}`);
      
      res.json({
        success: true,
        message: 'OTP resent successfully',
        debugOtp: process.env.NODE_ENV === 'development' ? verificationCode : undefined
      });
      
    } catch (err) {
      console.error('Error resending OTP:', err);
      res.status(500).json({ error: 'Failed to resend OTP' });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const user = result.rows[0];
      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          membershipLevel: user.membership_level,
          points: user.points,
          totalOrders: user.total_orders,
          isVerified: user.is_verified,
          address: {
            street: user.address_street,
            city: user.address_city,
            district: user.address_district,
            postalCode: user.address_postal_code
          },
          createdAt: user.created_at
        }
      });
    } catch (err) {
      console.error('Error getting profile:', err);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  },

  // Update user profile
  async updateProfile(req, res) {
    const { name, email, address } = req.body;
    
    try {
      const result = await pool.query(
        `UPDATE users SET 
          name = $1, 
          email = $2, 
          address_street = $3, 
          address_city = $4, 
          address_district = $5, 
          address_postal_code = $6,
          updated_at = CURRENT_TIMESTAMP
         WHERE id = $7 RETURNING *`,
        [
          name,
          email,
          address?.street,
          address?.city,
          address?.district,
          address?.postalCode,
          req.user.id
        ]
      );
      
      const updatedUser = result.rows[0];
      
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          address: {
            street: updatedUser.address_street,
            city: updatedUser.address_city,
            district: updatedUser.address_district,
            postalCode: updatedUser.address_postal_code
          }
        }
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
};

module.exports = authController;