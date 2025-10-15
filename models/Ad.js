const { pool } = require('../config/database');

class Ad {
  static async create(adData) {
    const {
      product_id, title, title_ar, description, description_ar,
      image_url, start_date, end_date, position, priority
    } = adData;

    const result = await pool.query(
      `INSERT INTO ads (
        product_id, title, title_ar, description, description_ar,
        image_url, start_date, end_date, position, priority
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
        product_id, title, title_ar, description, description_ar,
        image_url, start_date, end_date, position, priority
      ]
    );

    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT ads.*, products.name as product_name 
       FROM ads LEFT JOIN products ON ads.product_id = products.id 
       WHERE ads.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findAllActive() {
    const result = await pool.query(
      `SELECT ads.*, products.name as product_name 
       FROM ads LEFT JOIN products ON ads.product_id = products.id 
       WHERE ads.is_active = true 
       AND ads.start_date <= NOW() 
       AND ads.end_date >= NOW() 
       ORDER BY ads.priority DESC`
    );
    return result.rows;
  }

  static async update(id, updates) {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const values = Object.values(updates);
    values.push(id);

    const result = await pool.query(
      `UPDATE ads SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${values.length} RETURNING *`,
      values
    );

    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM ads WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Ad;