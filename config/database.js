// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'beauty_shop',
//   password: process.env.DB_PASSWORD || 'password',
//   port: process.env.DB_PORT || 5432,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// // Database initialization
// async function initDatabase() {
//   try {
//     // Create tables if they don't exist
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255),
//         phone VARCHAR(20) UNIQUE NOT NULL,
//         email VARCHAR(255) UNIQUE,
//         password VARCHAR(255),
//         verification_code VARCHAR(6),
//         is_verified BOOLEAN DEFAULT false,
//         role VARCHAR(50) DEFAULT 'customer',
//         membership_level VARCHAR(50) DEFAULT 'bronze',
//         points INTEGER DEFAULT 0,
//         total_orders INTEGER DEFAULT 0,
//         address_street VARCHAR(255),
//         address_city VARCHAR(100),
//         address_district VARCHAR(100),
//         address_postal_code VARCHAR(20),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         icon VARCHAR(50),
//         color VARCHAR(100),
//         product_count INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         brand VARCHAR(255),
//         price DECIMAL(10,2) NOT NULL,
//         original_price DECIMAL(10,2),
//         description TEXT,
//         description_ar TEXT,
//         category_id INTEGER REFERENCES categories(id),
//         image_url VARCHAR(500),
//         emoji_icon VARCHAR(10),
//         rating DECIMAL(3,2) DEFAULT 0,
//         reviews_count INTEGER DEFAULT 0,
//         in_stock BOOLEAN DEFAULT true,
//         discount INTEGER DEFAULT 0,
//         badge VARCHAR(50),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS cart (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         quantity INTEGER DEFAULT 1,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS favorites (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         order_number VARCHAR(50) UNIQUE,
//         user_id INTEGER REFERENCES users(id),
//         status VARCHAR(50) DEFAULT 'pending',
//         total_amount DECIMAL(10,2),
//         shipping_cost DECIMAL(10,2) DEFAULT 0,
//         discount_amount DECIMAL(10,2) DEFAULT 0,
//         delivery_address TEXT,
//         delivery_phone VARCHAR(20),
//         delivery_name VARCHAR(255),
//         notes TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS order_items (
//         id SERIAL PRIMARY KEY,
//         order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id),
//         quantity INTEGER DEFAULT 1,
//         price DECIMAL(10,2),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS reviews (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         rating INTEGER CHECK (rating >= 1 AND rating <= 5),
//         comment TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS notifications (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         title VARCHAR(255),
//         message TEXT,
//         type VARCHAR(50),
//         is_read BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     console.log('Database tables initialized successfully');
//   } catch (err) {
//     console.error('Error initializing database:', err);
//   }
// }

// module.exports = { pool, initDatabase };




// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'beauty_shop',
//   password: process.env.DB_PASSWORD || 'password',
//   port: process.env.DB_PORT || 5432,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// // Database initialization
// async function initDatabase() {
//   try {
//     // Create tables if they don't exist
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255),
//         phone VARCHAR(20) UNIQUE NOT NULL,
//         email VARCHAR(255),
//         role VARCHAR(50) DEFAULT 'customer',
//         membership_level VARCHAR(50) DEFAULT 'bronze',
//         points INTEGER DEFAULT 0,
//         total_orders INTEGER DEFAULT 0,
//         address_street VARCHAR(255),
//         address_city VARCHAR(100),
//         address_district VARCHAR(100),
//         address_postal_code VARCHAR(20),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         icon VARCHAR(50),
//         color VARCHAR(100),
//         product_count INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         brand VARCHAR(255),
//         price DECIMAL(10,2) NOT NULL,
//         original_price DECIMAL(10,2),
//         description TEXT,
//         description_ar TEXT,
//         category_id INTEGER REFERENCES categories(id),
//         image_url VARCHAR(500),
//         emoji_icon VARCHAR(10),
//         rating DECIMAL(3,2) DEFAULT 0,
//         reviews_count INTEGER DEFAULT 0,
//         in_stock BOOLEAN DEFAULT true,
//         discount INTEGER DEFAULT 0,
//         badge VARCHAR(50),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS cart (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         quantity INTEGER DEFAULT 1,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS favorites (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         order_number VARCHAR(50) UNIQUE,
//         user_id INTEGER REFERENCES users(id),
//         status VARCHAR(50) DEFAULT 'pending',
//         total_amount DECIMAL(10,2),
//         shipping_cost DECIMAL(10,2) DEFAULT 0,
//         discount_amount DECIMAL(10,2) DEFAULT 0,
//         delivery_address TEXT,
//         delivery_phone VARCHAR(20),
//         delivery_name VARCHAR(255),
//         notes TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS order_items (
//         id SERIAL PRIMARY KEY,
//         order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id),
//         quantity INTEGER DEFAULT 1,
//         price DECIMAL(10,2),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS reviews (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         rating INTEGER CHECK (rating >= 1 AND rating <= 5),
//         comment TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS notifications (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         title VARCHAR(255),
//         message TEXT,
//         type VARCHAR(50),
//         is_read BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     console.log('Database tables initialized successfully');
//   } catch (err) {
//     console.error('Error initializing database:', err);
//   }
// }

// module.exports = { pool, initDatabase };




// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'beauty_shop',
//   password: process.env.DB_PASSWORD || 'password',
//   port: process.env.DB_PORT || 5432,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// // Database initialization
// async function initDatabase() {
//   try {
//     // Create tables if they don't exist
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255),
//         phone VARCHAR(20) UNIQUE NOT NULL,
//         email VARCHAR(255),
//         role VARCHAR(50) DEFAULT 'customer',
//         membership_level VARCHAR(50) DEFAULT 'bronze',
//         points INTEGER DEFAULT 0,
//         total_orders INTEGER DEFAULT 0,
//         address_street VARCHAR(255),
//         address_city VARCHAR(100),
//         address_district VARCHAR(100),
//         address_postal_code VARCHAR(20),
//         verification_code VARCHAR(10),
//         code_expires_at TIMESTAMP,
//         is_verified BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         icon VARCHAR(50),
//         color VARCHAR(100),
//         product_count INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         brand VARCHAR(255),
//         price DECIMAL(10,2) NOT NULL,
//         original_price DECIMAL(10,2),
//         description TEXT,
//         description_ar TEXT,
//         category_id INTEGER REFERENCES categories(id),
//         image_url VARCHAR(500),
//         emoji_icon VARCHAR(10),
//         rating DECIMAL(3,2) DEFAULT 0,
//         reviews_count INTEGER DEFAULT 0,
//         in_stock BOOLEAN DEFAULT true,
//         discount INTEGER DEFAULT 0,
//         badge VARCHAR(50),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS cart (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         quantity INTEGER DEFAULT 1,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS favorites (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         order_number VARCHAR(50) UNIQUE,
//         user_id INTEGER REFERENCES users(id),
//         status VARCHAR(50) DEFAULT 'pending',
//         total_amount DECIMAL(10,2),
//         shipping_cost DECIMAL(10,2) DEFAULT 0,
//         discount_amount DECIMAL(10,2) DEFAULT 0,
//         delivery_address TEXT,
//         delivery_phone VARCHAR(20),
//         delivery_name VARCHAR(255),
//         notes TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS order_items (
//         id SERIAL PRIMARY KEY,
//         order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id),
//         quantity INTEGER DEFAULT 1,
//         price DECIMAL(10,2),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS reviews (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         rating INTEGER CHECK (rating >= 1 AND rating <= 5),
//         comment TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS notifications (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         title VARCHAR(255),
//         message TEXT,
//         type VARCHAR(50),
//         is_read BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // Create index for better performance on OTP verification
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_users_phone_verification 
//       ON users(phone, verification_code, code_expires_at)
//     `);

//     // Create index for phone lookups
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_users_phone 
//       ON users(phone)
//     `);

//     console.log('Database tables initialized successfully');
//   } catch (err) {
//     console.error('Error initializing database:', err);
//   }
// }

// // Function to clean expired OTP codes (run periodically)
// async function cleanExpiredOTPs() {
//   try {
//     const result = await pool.query(
//       'UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE code_expires_at < NOW()'
//     );
//     console.log(`Cleaned ${result.rowCount} expired OTPs`);
//   } catch (err) {
//     console.error('Error cleaning expired OTPs:', err);
//   }
// }

// // Run OTP cleanup every hour
// setInterval(cleanExpiredOTPs, 60 * 60 * 1000);

// module.exports = { pool, initDatabase, cleanExpiredOTPs };





// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'beauty_shop',
//   password: process.env.DB_PASSWORD || 'password',
//   port: process.env.DB_PORT || 5432,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// // Database initialization
// async function initDatabase() {
//   try {
//     // Create tables if they don't exist
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255),
//         phone VARCHAR(20) UNIQUE NOT NULL,
//         email VARCHAR(255),
//         role VARCHAR(50) DEFAULT 'customer',
//         membership_level VARCHAR(50) DEFAULT 'bronze',
//         points INTEGER DEFAULT 0,
//         total_orders INTEGER DEFAULT 0,
//         address_street VARCHAR(255),
//         address_city VARCHAR(100),
//         address_district VARCHAR(100),
//         address_postal_code VARCHAR(20),
//         verification_code VARCHAR(10),
//         code_expires_at TIMESTAMP,
//         is_verified BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         icon VARCHAR(50),
//         color VARCHAR(100),
//         product_count INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         brand VARCHAR(255),
//         price DECIMAL(10,2) NOT NULL,
//         original_price DECIMAL(10,2),
//         description TEXT,
//         description_ar TEXT,
//         category_id INTEGER REFERENCES categories(id),
//         image_url VARCHAR(500),
//         emoji_icon VARCHAR(10),
//         rating DECIMAL(3,2) DEFAULT 0,
//         reviews_count INTEGER DEFAULT 0,
//         in_stock BOOLEAN DEFAULT true,
//         discount INTEGER DEFAULT 0,
//         badge VARCHAR(50),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS ads (
//         id SERIAL PRIMARY KEY,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         title VARCHAR(255) NOT NULL,
//         title_ar VARCHAR(255) NOT NULL,
//         description TEXT,
//         description_ar TEXT,
//         image_url VARCHAR(500),
//         start_date TIMESTAMP NOT NULL,
//         end_date TIMESTAMP NOT NULL,
//         is_active BOOLEAN DEFAULT true,
//         click_count INTEGER DEFAULT 0,
//         view_count INTEGER DEFAULT 0,
//         position VARCHAR(100) DEFAULT 'home_banner',
//         priority INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS cart (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         quantity INTEGER DEFAULT 1,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS favorites (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         order_number VARCHAR(50) UNIQUE,
//         user_id INTEGER REFERENCES users(id),
//         status VARCHAR(50) DEFAULT 'pending',
//         total_amount DECIMAL(10,2),
//         shipping_cost DECIMAL(10,2) DEFAULT 0,
//         discount_amount DECIMAL(10,2) DEFAULT 0,
//         delivery_address TEXT,
//         delivery_phone VARCHAR(20),
//         delivery_name VARCHAR(255),
//         notes TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS order_items (
//         id SERIAL PRIMARY KEY,
//         order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id),
//         quantity INTEGER DEFAULT 1,
//         price DECIMAL(10,2),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS reviews (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         rating INTEGER CHECK (rating >= 1 AND rating <= 5),
//         comment TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS notifications (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         title VARCHAR(255),
//         message TEXT,
//         type VARCHAR(50),
//         is_read BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // Create index for better performance on OTP verification
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_users_phone_verification 
//       ON users(phone, verification_code, code_expires_at)
//     `);

//     // Create index for phone lookups
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_users_phone 
//       ON users(phone)
//     `);

//     // Create indexes for ads table
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_ads_product_id 
//       ON ads(product_id)
//     `);

//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_ads_active_dates 
//       ON ads(is_active, start_date, end_date)
//     `);

//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_ads_position_priority 
//       ON ads(position, priority DESC)
//     `);

//     console.log('Database tables initialized successfully');
//   } catch (err) {
//     console.error('Error initializing database:', err);
//   }
// }

// // Function to clean expired OTP codes (run periodically)
// async function cleanExpiredOTPs() {
//   try {
//     const result = await pool.query(
//       'UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE code_expires_at < NOW()'
//     );
//     console.log(`Cleaned ${result.rowCount} expired OTPs`);
//   } catch (err) {
//     console.error('Error cleaning expired OTPs:', err);
//   }
// }

// // Function to update ads status based on dates (run periodically)
// async function updateAdsStatus() {
//   try {
//     // Deactivate expired ads
//     const deactivateResult = await pool.query(
//       'UPDATE ads SET is_active = false WHERE end_date < NOW() AND is_active = true'
//     );
    
//     // Activate ads that should be active
//     const activateResult = await pool.query(
//       'UPDATE ads SET is_active = true WHERE start_date <= NOW() AND end_date >= NOW() AND is_active = false'
//     );
    
//     console.log(`Updated ads status - Deactivated: ${deactivateResult.rowCount}, Activated: ${activateResult.rowCount}`);
//   } catch (err) {
//     console.error('Error updating ads status:', err);
//   }
// }

// // Run OTP cleanup every hour
// setInterval(cleanExpiredOTPs, 60 * 60 * 1000);

// // Run ads status update every 30 minutes
// setInterval(updateAdsStatus, 30 * 60 * 1000);

// module.exports = { pool, initDatabase, cleanExpiredOTPs, updateAdsStatus };





// const { Pool } = require('pg');

// const pool = new Pool({
//   user: process.env.DB_USER || 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   database: process.env.DB_NAME || 'beauty_shop',
//   password: process.env.DB_PASSWORD || 'password',
//   port: process.env.DB_PORT || 5432,
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });


// const { Pool } = require('pg');

// // For Render, use the external database URL or individual connection parameters
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL || 
//     `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  
//   // Render PostgreSQL requires SSL in production
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
// });

// // Test connection
// pool.on('connect', () => {
//   console.log('Connected to PostgreSQL database');
// });

// pool.on('error', (err) => {
//   console.error('Database connection error:', err);
// });

// // ... rest of your initialization code remains the same
// // Database initialization
// async function initDatabase() {
//   try {
//     // Create tables if they don't exist
// await pool.query(`
//   CREATE TABLE IF NOT EXISTS products (
//     id SERIAL PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     name_ar VARCHAR(255) NOT NULL,
//     brand VARCHAR(255),
//     price DECIMAL(10,2) NOT NULL,
//     original_price DECIMAL(10,2),
//     description TEXT,
//     description_ar TEXT,
//     category_id INTEGER REFERENCES categories(id),
//     image_url VARCHAR(500),
//     emoji_icon VARCHAR(10),
//     rating DECIMAL(3,2) DEFAULT 0,
//     reviews_count INTEGER DEFAULT 0,
//     in_stock BOOLEAN DEFAULT true,
//     discount INTEGER DEFAULT 0,
//     badge VARCHAR(50),
//     stock_quantity INTEGER DEFAULT 0,  -- ✅ تمت الإضافة
//     sale_price DECIMAL(10,2),          -- ✅ تمت الإضافة
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   )
// `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS categories (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         icon VARCHAR(50),
//         color VARCHAR(100),
//         image_url VARCHAR(500),
//         product_count INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS products (
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         name_ar VARCHAR(255) NOT NULL,
//         brand VARCHAR(255),
//         price DECIMAL(10,2) NOT NULL,
//         original_price DECIMAL(10,2),
//         description TEXT,
//         description_ar TEXT,
//         category_id INTEGER REFERENCES categories(id),
//         image_url VARCHAR(500),
//         emoji_icon VARCHAR(10),
//         rating DECIMAL(3,2) DEFAULT 0,
//         reviews_count INTEGER DEFAULT 0,
//         in_stock BOOLEAN DEFAULT true,
//         discount INTEGER DEFAULT 0,
//         badge VARCHAR(50),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS ads (
//         id SERIAL PRIMARY KEY,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         title VARCHAR(255) NOT NULL,
//         title_ar VARCHAR(255) NOT NULL,
//         description TEXT,
//         description_ar TEXT,
//         image_url VARCHAR(500),
//         start_date TIMESTAMP NOT NULL,
//         end_date TIMESTAMP NOT NULL,
//         is_active BOOLEAN DEFAULT true,
//         click_count INTEGER DEFAULT 0,
//         view_count INTEGER DEFAULT 0,
//         position VARCHAR(100) DEFAULT 'home_banner',
//         priority INTEGER DEFAULT 0,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS cart (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         quantity INTEGER DEFAULT 1,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS favorites (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS orders (
//         id SERIAL PRIMARY KEY,
//         order_number VARCHAR(50) UNIQUE,
//         user_id INTEGER REFERENCES users(id),
//         status VARCHAR(50) DEFAULT 'pending',
//         total_amount DECIMAL(10,2),
//         shipping_cost DECIMAL(10,2) DEFAULT 0,
//         discount_amount DECIMAL(10,2) DEFAULT 0,
//         delivery_address TEXT,
//         delivery_phone VARCHAR(20),
//         delivery_name VARCHAR(255),
//         notes TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS order_items (
//         id SERIAL PRIMARY KEY,
//         order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id),
//         quantity INTEGER DEFAULT 1,
//         price DECIMAL(10,2),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS reviews (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
//         rating INTEGER CHECK (rating >= 1 AND rating <= 5),
//         comment TEXT,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         UNIQUE(user_id, product_id)
//       )
//     `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS notifications (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//         title VARCHAR(255),
//         message TEXT,
//         type VARCHAR(50),
//         is_read BOOLEAN DEFAULT false,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       )
//     `);

//     // Create index for better performance on OTP verification
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_users_phone_verification 
//       ON users(phone, verification_code, code_expires_at)
//     `);

//     // Create index for phone lookups
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_users_phone 
//       ON users(phone)
//     `);

//     // Create indexes for ads table
//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_ads_product_id 
//       ON ads(product_id)
//     `);

//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_ads_active_dates 
//       ON ads(is_active, start_date, end_date)
//     `);

//     await pool.query(`
//       CREATE INDEX IF NOT EXISTS idx_ads_position_priority 
//       ON ads(position, priority DESC)
//     `);

//     console.log('Database tables initialized successfully');
//   } catch (err) {
//     console.error('Error initializing database:', err);
//   }
// }

// // Function to clean expired OTP codes (run periodically)
// async function cleanExpiredOTPs() {
//   try {
//     const result = await pool.query(
//       'UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE code_expires_at < NOW()'
//     );
//     console.log(`Cleaned ${result.rowCount} expired OTPs`);
//   } catch (err) {
//     console.error('Error cleaning expired OTPs:', err);
//   }
// }

// // Function to update ads status based on dates (run periodically)
// async function updateAdsStatus() {
//   try {
//     // Deactivate expired ads
//     const deactivateResult = await pool.query(
//       'UPDATE ads SET is_active = false WHERE end_date < NOW() AND is_active = true'
//     );
    
//     // Activate ads that should be active
//     const activateResult = await pool.query(
//       'UPDATE ads SET is_active = true WHERE start_date <= NOW() AND end_date >= NOW() AND is_active = false'
//     );
    
//     console.log(`Updated ads status - Deactivated: ${deactivateResult.rowCount}, Activated: ${activateResult.rowCount}`);
//   } catch (err) {
//     console.error('Error updating ads status:', err);
//   }
// }

// // Run OTP cleanup every hour
// setInterval(cleanExpiredOTPs, 60 * 60 * 1000);

// // Run ads status update every 30 minutes
// setInterval(updateAdsStatus, 30 * 60 * 1000);

// module.exports = { pool, initDatabase, cleanExpiredOTPs, updateAdsStatus };












const { Pool } = require('pg');

// For Render, use the external database URL or individual connection parameters
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  
  // Render PostgreSQL requires SSL in production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
});

// Database initialization
async function initDatabase() {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        phone VARCHAR(20) UNIQUE NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50) DEFAULT 'customer',
        membership_level VARCHAR(50) DEFAULT 'bronze',
        points INTEGER DEFAULT 0,
        total_orders INTEGER DEFAULT 0,
        address_street VARCHAR(255),
        address_city VARCHAR(100),
        address_district VARCHAR(100),
        address_postal_code VARCHAR(20),
        verification_code VARCHAR(10),
        code_expires_at TIMESTAMP,
        is_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        icon VARCHAR(50),
        color VARCHAR(100),
        image_url VARCHAR(500),
        product_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        name_ar VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        price DECIMAL(10,2) NOT NULL,
        original_price DECIMAL(10,2),
        description TEXT,
        description_ar TEXT,
        category_id INTEGER REFERENCES categories(id),
        image_url VARCHAR(500),
        emoji_icon VARCHAR(10),
        rating DECIMAL(3,2) DEFAULT 0,
        reviews_count INTEGER DEFAULT 0,
        in_stock BOOLEAN DEFAULT true,
        discount INTEGER DEFAULT 0,
        badge VARCHAR(50),
        stock_quantity INTEGER DEFAULT 0,
        sale_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    

    await pool.query(`
      CREATE TABLE IF NOT EXISTS ads (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        title_ar VARCHAR(255) NOT NULL,
        description TEXT,
        description_ar TEXT,
        image_url VARCHAR(500),
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        is_active BOOLEAN DEFAULT true,
        click_count INTEGER DEFAULT 0,
        view_count INTEGER DEFAULT 0,
        position VARCHAR(100) DEFAULT 'home_banner',
        priority INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE,
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        total_amount DECIMAL(10,2),
        shipping_cost DECIMAL(10,2) DEFAULT 0,
        discount_amount DECIMAL(10,2) DEFAULT 0,
        delivery_address TEXT,
        delivery_phone VARCHAR(20),
        delivery_name VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER DEFAULT 1,
        price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, product_id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255),
        message TEXT,
        type VARCHAR(50),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for better performance on OTP verification
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_phone_verification 
      ON users(phone, verification_code, code_expires_at)
    `);

    // Create index for phone lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_phone 
      ON users(phone)
    `);

    // Create indexes for ads table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ads_product_id 
      ON ads(product_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ads_active_dates 
      ON ads(is_active, start_date, end_date)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ads_position_priority 
      ON ads(position, priority DESC)
    `);

    // إضافة الأعمدة إذا لم تكن موجودة (للتوافق مع الإصدارات القديمة)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='products' AND column_name='stock_quantity') THEN
            ALTER TABLE products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='products' AND column_name='sale_price') THEN
            ALTER TABLE products ADD COLUMN sale_price DECIMAL(10,2);
        END IF;
      END $$;
    `);

    console.log('Database tables initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

// Function to clean expired OTP codes (run periodically)
async function cleanExpiredOTPs() {
  try {
    const result = await pool.query(
      'UPDATE users SET verification_code = NULL, code_expires_at = NULL WHERE code_expires_at < NOW()'
    );
    console.log(`Cleaned ${result.rowCount} expired OTPs`);
  } catch (err) {
    console.error('Error cleaning expired OTPs:', err);
  }
}

// Function to update ads status based on dates (run periodically)
async function updateAdsStatus() {
  try {
    // Deactivate expired ads
    const deactivateResult = await pool.query(
      'UPDATE ads SET is_active = false WHERE end_date < NOW() AND is_active = true'
    );
    
    // Activate ads that should be active
    const activateResult = await pool.query(
      'UPDATE ads SET is_active = true WHERE start_date <= NOW() AND end_date >= NOW() AND is_active = false'
    );
    
    console.log(`Updated ads status - Deactivated: ${deactivateResult.rowCount}, Activated: ${activateResult.rowCount}`);
  } catch (err) {
    console.error('Error updating ads status:', err);
  }
}

// Run OTP cleanup every hour
setInterval(cleanExpiredOTPs, 60 * 60 * 1000);

// Run ads status update every 30 minutes
setInterval(updateAdsStatus, 30 * 60 * 1000);

module.exports = { pool, initDatabase, cleanExpiredOTPs, updateAdsStatus };






