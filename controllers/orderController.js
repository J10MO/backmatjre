const { pool } = require('../config/database');

const orderController = {
  // Create order
  async createOrder(req, res) {
    const { delivery_address, delivery_phone, delivery_name, notes } = req.body;
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const cartResult = await client.query(
        `SELECT c.*, p.price, p.name
         FROM cart c
         JOIN products p ON c.product_id = p.id
         WHERE c.user_id = $1`,
        [req.user.id]
      );
      
      if (cartResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Cart is empty' });
      }
      
      const totalAmount = cartResult.rows.reduce((sum, item) => 
        sum + (parseFloat(item.price) * item.quantity), 0
      );
      
      const orderNumber = 'ORD-' + Date.now();
      const orderResult = await client.query(
        `INSERT INTO orders (order_number, user_id, total_amount, delivery_address, delivery_phone, delivery_name, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [orderNumber, req.user.id, totalAmount, delivery_address, delivery_phone, delivery_name, notes]
      );
      
      const order = orderResult.rows[0];
      
      for (const item of cartResult.rows) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES ($1, $2, $3, $4)`,
          [order.id, item.product_id, item.quantity, item.price]
        );
      }
      
      await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
      
      const pointsEarned = Math.floor(totalAmount * 0.1);
      await client.query(
        `UPDATE users 
         SET points = points + $1, 
             total_orders = total_orders + 1,
             membership_level = CASE
               WHEN total_orders + 1 >= 50 THEN 'platinum'
               WHEN total_orders + 1 >= 20 THEN 'gold'
               WHEN total_orders + 1 >= 10 THEN 'silver'
               ELSE 'bronze'
             END
         WHERE id = $2`,
        [pointsEarned, req.user.id]
      );
      
      await client.query(
        `INSERT INTO notifications (user_id, title, message, type)
         VALUES ($1, $2, $3, $4)`,
        [
          req.user.id,
          'تم تأكيد طلبك',
          `تم استلام طلبك رقم ${orderNumber} بنجاح وسيتم التواصل معك قريباً`,
          'order_confirmed'
        ]
      );
      
      await client.query('COMMIT');
      
      res.json({
        message: 'Order created successfully',
        order: order,
        pointsEarned: pointsEarned
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error creating order:', err);
      res.status(500).json({ error: 'Server error' });
    } finally {
      client.release();
    }
  },

  // Get user's orders
  async getOrders(req, res) {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
      let query = 'SELECT * FROM orders WHERE user_id = $1';
      const params = [req.user.id];
      
      if (status) {
        params.push(status);
        query += ' AND status = $2';
      }
      
      query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      
      for (const order of result.rows) {
        const itemsResult = await pool.query(
          `SELECT oi.*, p.name, p.image_url, p.emoji_icon
           FROM order_items oi
           JOIN products p ON oi.product_id = p.id
           WHERE oi.order_id = $1`,
          [order.id]
        );
        order.items = itemsResult.rows;
      }
      
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = orderController;