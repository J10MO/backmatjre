// update-database.js
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function updateSchema() {
  try {
    console.log('🔄 Updating database schema...');
    
    // Add missing columns
    await pool.query(`
      DO $$ 
      BEGIN 
        -- Add last_login column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='last_login') THEN
            ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
            RAISE NOTICE 'Added last_login column';
        ELSE
            RAISE NOTICE 'last_login column already exists';
        END IF;
        
        -- Add password_hash column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='password_hash') THEN
            ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
            RAISE NOTICE 'Added password_hash column';
        ELSE
            RAISE NOTICE 'password_hash column already exists';
        END IF;
        
        -- Add permissions column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name='users' AND column_name='permissions') THEN
            ALTER TABLE users ADD COLUMN permissions JSONB DEFAULT '["all"]';
            RAISE NOTICE 'Added permissions column';
        ELSE
            RAISE NOTICE 'permissions column already exists';
        END IF;
      END $$;
    `);
    
    console.log('✅ Database schema updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating database schema:', error);
  } finally {
    await pool.end();
  }
}

updateSchema();