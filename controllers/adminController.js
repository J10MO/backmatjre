const { pool } = require('../config/database');
const { generateToken, generateVerificationCode } = require('../utils/helpers');
const { getIO } = require('../utils/socket');

const authController = {
  // Check if phone exists
  async checkPhone(req, res) {
    const { phone } = req.body;
    
    try {
      const result = await pool.query('SELECT id, is_verified FROM users WHERE phone = $1', [phone]);
      
      if (result.rows.length > 0) {
        const verificationCode = generateVerificationCode();
        await pool.query(
          'UPDATE users SET verification_code = $1 WHERE phone = $2',
          [verificationCode, phone]
        );
        
        console.log(`Verification code for ${phone}: ${verificationCode}`);
        
        res.json({ 
          exists: true, 
          isVerified: result.rows[0].is_verified,
          message: 'Verification code sent'
        });
      } else {
        res.json({ exists: false });
      }
    } catch (err) {
      console.error('Error checking phone:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Register new user
  async register(req, res) {
    const { name, phone, email, address } = req.body;
    
    try {
      const verificationCode = generateVerificationCode();
      
      const result = await pool.query(
        `INSERT INTO users (name, phone, email, verification_code, address_street, address_city, address_district, address_postal_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [name, phone, email, verificationCode, address?.street, address?.city, address?.district, address?.postalCode]
      );
      
      const user = result.rows[0];
      
      console.log(`Verification code for ${phone}: ${verificationCode}`);
      
      res.json({ 
        message: 'User registered successfully',
        userId: user.id,
        verificationRequired: true
      });
    } catch (err) {
      console.error('Error registering user:', err);
      if (err.code === '23505') {
        res.status(400).json({ error: 'Phone number already exists' });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  },

  // Verify code and login
  async verify(req, res) {
    const { phone, code } = req.body;
    
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE phone = $1 AND verification_code = $2',
        [phone, code]
      );
      
      if (result.rows.length === 0) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
      
      const user = result.rows[0];
      
      await pool.query(
        'UPDATE users SET is_verified = true, verification_code = NULL WHERE id = $1',
        [user.id]
      );
      
      const token = generateToken(user);
      const io = getIO();
      
      io.emit('user_logged_in', { userId: user.id, name: user.name });
      
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          membershipLevel: user.membership_level,
          points: user.points,
          totalOrders: user.total_orders,
          address: {
            street: user.address_street,
            city: user.address_city,
            district: user.address_district,
            postalCode: user.address_postal_code
          }
        }
      });
    } catch (err) {
      console.error('Error verifying code:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = authController;