const { pool } = require('../config/database');

async function migrateOTPColumns() {
  try {
    console.log('Starting database migration...');

    // Check if columns already exist
    const checkColumns = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name IN ('verification_code', 'code_expires_at', 'is_verified')
    `);

    const existingColumns = checkColumns.rows.map(row => row.column_name);
    console.log('Existing columns:', existingColumns);

    // Add missing columns
    if (!existingColumns.includes('verification_code')) {
      await pool.query('ALTER TABLE users ADD COLUMN verification_code VARCHAR(10)');
      console.log('✓ Added verification_code column');
    }

    if (!existingColumns.includes('code_expires_at')) {
      await pool.query('ALTER TABLE users ADD COLUMN code_expires_at TIMESTAMP');
      console.log('✓ Added code_expires_at column');
    }

    if (!existingColumns.includes('is_verified')) {
      await pool.query('ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT false');
      console.log('✓ Added is_verified column');
    }

    // Update existing users to be verified (since they registered without OTP)
    await pool.query("UPDATE users SET is_verified = true WHERE is_verified IS NULL OR is_verified = false");
    console.log('✓ Updated existing users to verified status');

    console.log('Database migration completed successfully!');
    
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    pool.end();
  }
}

migrateOTPColumns();