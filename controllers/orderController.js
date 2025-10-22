// const { pool } = require('../config/database');

// const orderController = {
//   // Create order
//   async createOrder(req, res) {
//     const { delivery_address, delivery_phone, delivery_name, notes } = req.body;
//     const client = await pool.connect();
    
//     try {
//       await client.query('BEGIN');
      
//       const cartResult = await client.query(
//         `SELECT c.*, p.price, p.name
//          FROM cart c
//          JOIN products p ON c.product_id = p.id
//          WHERE c.user_id = $1`,
//         [req.user.id]
//       );
      
//       if (cartResult.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(400).json({ error: 'Cart is empty' });
//       }
      
//       const totalAmount = cartResult.rows.reduce((sum, item) => 
//         sum + (parseFloat(item.price) * item.quantity), 0
//       );
      
//       const orderNumber = 'ORD-' + Date.now();
//       const orderResult = await client.query(
//         `INSERT INTO orders (order_number, user_id, total_amount, delivery_address, delivery_phone, delivery_name, notes)
//          VALUES ($1, $2, $3, $4, $5, $6, $7)
//          RETURNING *`,
//         [orderNumber, req.user.id, totalAmount, delivery_address, delivery_phone, delivery_name, notes]
//       );
      
//       const order = orderResult.rows[0];
      
//       for (const item of cartResult.rows) {
//         await client.query(
//           `INSERT INTO order_items (order_id, product_id, quantity, price)
//            VALUES ($1, $2, $3, $4)`,
//           [order.id, item.product_id, item.quantity, item.price]
//         );
//       }
      
//       await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
      
//       const pointsEarned = Math.floor(totalAmount * 0.1);
//       await client.query(
//         `UPDATE users 
//          SET points = points + $1, 
//              total_orders = total_orders + 1,
//              membership_level = CASE
//                WHEN total_orders + 1 >= 50 THEN 'platinum'
//                WHEN total_orders + 1 >= 20 THEN 'gold'
//                WHEN total_orders + 1 >= 10 THEN 'silver'
//                ELSE 'bronze'
//              END
//          WHERE id = $2`,
//         [pointsEarned, req.user.id]
//       );
      
//       await client.query(
//         `INSERT INTO notifications (user_id, title, message, type)
//          VALUES ($1, $2, $3, $4)`,
//         [
//           req.user.id,
//           'تم تأكيد طلبك',
//           `تم استلام طلبك رقم ${orderNumber} بنجاح وسيتم التواصل معك قريباً`,
//           'order_confirmed'
//         ]
//       );
      
//       await client.query('COMMIT');
      
//       res.json({
//         message: 'Order created successfully',
//         order: order,
//         pointsEarned: pointsEarned
//       });
//     } catch (err) {
//       await client.query('ROLLBACK');
//       console.error('Error creating order:', err);
//       res.status(500).json({ error: 'Server error' });
//     } finally {
//       client.release();
//     }
//   },

//   // Get user's orders
//   async getOrders(req, res) {
//     const { status, page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * limit;
    
//     try {
//       let query = 'SELECT * FROM orders WHERE user_id = $1';
//       const params = [req.user.id];
      
//       if (status) {
//         params.push(status);
//         query += ' AND status = $2';
//       }
      
//       query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
//       params.push(limit, offset);
      
//       const result = await pool.query(query, params);
      
//       for (const order of result.rows) {
//         const itemsResult = await pool.query(
//           `SELECT oi.*, p.name, p.image_url, p.emoji_icon
//            FROM order_items oi
//            JOIN products p ON oi.product_id = p.id
//            WHERE oi.order_id = $1`,
//           [order.id]
//         );
//         order.items = itemsResult.rows;
//       }
      
//       res.json(result.rows);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = orderController;








// const { pool } = require('../config/database');

// const orderController = {
//   // Create order
//   async createOrder(req, res) {
//     const { delivery_address, delivery_phone, delivery_name, notes } = req.body;
//     const client = await pool.connect();
    
//     try {
//       await client.query('BEGIN');
      
//       const cartResult = await client.query(
//         `SELECT c.*, p.price, p.name
//          FROM cart c
//          JOIN products p ON c.product_id = p.id
//          WHERE c.user_id = $1`,
//         [req.user.id]
//       );
      
//       if (cartResult.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(400).json({ error: 'Cart is empty' });
//       }
      
//       const totalAmount = cartResult.rows.reduce((sum, item) => 
//         sum + (parseFloat(item.price) * item.quantity), 0
//       );
      
//       const orderNumber = 'ORD-' + Date.now();
//       const orderResult = await client.query(
//         `INSERT INTO orders (order_number, user_id, total_amount, delivery_address, delivery_phone, delivery_name, notes)
//          VALUES ($1, $2, $3, $4, $5, $6, $7)
//          RETURNING *`,
//         [orderNumber, req.user.id, totalAmount, delivery_address, delivery_phone, delivery_name, notes]
//       );
      
//       const order = orderResult.rows[0];
      
//       for (const item of cartResult.rows) {
//         await client.query(
//           `INSERT INTO order_items (order_id, product_id, quantity, price)
//            VALUES ($1, $2, $3, $4)`,
//           [order.id, item.product_id, item.quantity, item.price]
//         );
//       }
      
//       await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
      
//       const pointsEarned = Math.floor(totalAmount * 0.1);
//       await client.query(
//         `UPDATE users 
//          SET points = points + $1, 
//              total_orders = total_orders + 1,
//              membership_level = CASE
//                WHEN total_orders + 1 >= 50 THEN 'platinum'
//                WHEN total_orders + 1 >= 20 THEN 'gold'
//                WHEN total_orders + 1 >= 10 THEN 'silver'
//                ELSE 'bronze'
//              END
//          WHERE id = $2`,
//         [pointsEarned, req.user.id]
//       );
      
//       await client.query(
//         `INSERT INTO notifications (user_id, title, message, type)
//          VALUES ($1, $2, $3, $4)`,
//         [
//           req.user.id,
//           'تم تأكيد طلبك',
//           `تم استلام طلبك رقم ${orderNumber} بنجاح وسيتم التواصل معك قريباً`,
//           'order_confirmed'
//         ]
//       );
      
//       await client.query('COMMIT');
      
//       res.json({
//         message: 'Order created successfully',
//         order: order,
//         pointsEarned: pointsEarned
//       });
//     } catch (err) {
//       await client.query('ROLLBACK');
//       console.error('Error creating order:', err);
//       res.status(500).json({ error: 'Server error' });
//     } finally {
//       client.release();
//     }
//   },

//   // Get user's orders (for regular users) or all orders (for admins)
//   async getOrders(req, res) {
//     const { status, page = 1, limit = 10, user_id } = req.query;
//     const offset = (page - 1) * limit;
    
//     try {
//       let query, params;
      
//       // If user is admin and specific user_id is provided, get that user's orders
//       if (req.user.role === 'admin' && user_id) {
//         query = 'SELECT * FROM orders WHERE user_id = $1';
//         params = [user_id];
//       } 
//       // If user is admin and no user_id provided, get all orders
//       else if (req.user.role === 'admin') {
//         query = 'SELECT o.*, u.name as user_name, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id = u.id';
//         params = [];
//       } 
//       // Regular user gets only their own orders
//       else {
//         query = 'SELECT * FROM orders WHERE user_id = $1';
//         params = [req.user.id];
//       }
      
//       if (status) {
//         if (params.length === 0) {
//           query += ' WHERE status = $1';
//         } else {
//           query += ' AND status = $' + (params.length + 1);
//         }
//         params.push(status);
//       }
      
//       query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
//       params.push(limit, offset);
      
//       const result = await pool.query(query, params);
      
//       // Get order items for each order
//       for (const order of result.rows) {
//         const itemsResult = await pool.query(
//           `SELECT oi.*, p.name, p.image_url, p.emoji_icon
//            FROM order_items oi
//            JOIN products p ON oi.product_id = p.id
//            WHERE oi.order_id = $1`,
//           [order.id]
//         );
//         order.items = itemsResult.rows;
//       }
      
//       res.json(result.rows);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Update order status (Admin only)
//   async updateOrderStatus(req, res) {
//     const { orderId } = req.params;
//     const { status, admin_notes } = req.body;
    
//     // Validate status
//     const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         error: 'Invalid status', 
//         validStatuses: validStatuses 
//       });
//     }
    
//     const client = await pool.connect();
    
//     try {
//       await client.query('BEGIN');
      
//       // Get current order details
//       const orderResult = await client.query(
//         'SELECT * FROM orders WHERE id = $1',
//         [orderId]
//       );
      
//       if (orderResult.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(404).json({ error: 'Order not found' });
//       }
      
//       const order = orderResult.rows[0];
//       const oldStatus = order.status;
      
//       // Update order status
//       const updateResult = await client.query(
//         `UPDATE orders 
//          SET status = $1, 
//              admin_notes = COALESCE($2, admin_notes),
//              updated_at = CURRENT_TIMESTAMP
//          WHERE id = $3
//          RETURNING *`,
//         [status, admin_notes, orderId]
//       );
      
//       const updatedOrder = updateResult.rows[0];
      
//       // Create notification for user if status changed
//       if (oldStatus !== status) {
//         let notificationTitle, notificationMessage;
        
//         switch (status) {
//           case 'confirmed':
//             notificationTitle = 'تم تأكيد طلبك';
//             notificationMessage = `تم تأكيد طلبك رقم ${order.order_number}`;
//             break;
//           case 'preparing':
//             notificationTitle = 'جاري تحضير طلبك';
//             notificationMessage = `جاري تحضير طلبك رقم ${order.order_number}`;
//             break;
//           case 'shipped':
//             notificationTitle = 'تم شحن طلبك';
//             notificationMessage = `تم شحن طلبك رقم ${order.order_number} وهو في الطريق إليك`;
//             break;
//           case 'delivered':
//             notificationTitle = 'تم توصيل طلبك';
//             notificationMessage = `تم توصيل طلبك رقم ${order.order_number} بنجاح. شكراً لاختيارك!`;
//             break;
//           case 'cancelled':
//             notificationTitle = 'تم إلغاء طلبك';
//             notificationMessage = `تم إلغاء طلبك رقم ${order.order_number}`;
//             break;
//           default:
//             notificationTitle = 'تحديث على طلبك';
//             notificationMessage = `تم تحديث حالة طلبك رقم ${order.order_number} إلى ${status}`;
//         }
        
//         await client.query(
//           `INSERT INTO notifications (user_id, title, message, type)
//            VALUES ($1, $2, $3, $4)`,
//           [order.user_id, notificationTitle, notificationMessage, 'order_updated']
//         );
//       }
      
//       await client.query('COMMIT');
      
//       res.json({
//         message: 'Order status updated successfully',
//         order: updatedOrder
//       });
//     } catch (err) {
//       await client.query('ROLLBACK');
//       console.error('Error updating order status:', err);
//       res.status(500).json({ error: 'Server error' });
//     } finally {
//       client.release();
//     }
//   },

//   // Update order details (Admin only)
//   async updateOrder(req, res) {
//     const { orderId } = req.params;
//     const { 
//       delivery_address, 
//       delivery_phone, 
//       delivery_name, 
//       notes, 
//       admin_notes,
//       total_amount 
//     } = req.body;
    
//     const client = await pool.connect();
    
//     try {
//       await client.query('BEGIN');
      
//       // Check if order exists
//       const orderResult = await client.query(
//         'SELECT * FROM orders WHERE id = $1',
//         [orderId]
//       );
      
//       if (orderResult.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(404).json({ error: 'Order not found' });
//       }
      
//       // Build dynamic update query
//       const updateFields = [];
//       const updateValues = [];
//       let paramCount = 1;
      
//       if (delivery_address !== undefined) {
//         updateFields.push(`delivery_address = $${paramCount}`);
//         updateValues.push(delivery_address);
//         paramCount++;
//       }
      
//       if (delivery_phone !== undefined) {
//         updateFields.push(`delivery_phone = $${paramCount}`);
//         updateValues.push(delivery_phone);
//         paramCount++;
//       }
      
//       if (delivery_name !== undefined) {
//         updateFields.push(`delivery_name = $${paramCount}`);
//         updateValues.push(delivery_name);
//         paramCount++;
//       }
      
//       if (notes !== undefined) {
//         updateFields.push(`notes = $${paramCount}`);
//         updateValues.push(notes);
//         paramCount++;
//       }
      
//       if (admin_notes !== undefined) {
//         updateFields.push(`admin_notes = $${paramCount}`);
//         updateValues.push(admin_notes);
//         paramCount++;
//       }
      
//       if (total_amount !== undefined) {
//         updateFields.push(`total_amount = $${paramCount}`);
//         updateValues.push(total_amount);
//         paramCount++;
//       }
      
//       if (updateFields.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(400).json({ error: 'No fields to update' });
//       }
      
//       updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
//       updateValues.push(orderId);
      
//       const updateQuery = `
//         UPDATE orders 
//         SET ${updateFields.join(', ')}
//         WHERE id = $${paramCount}
//         RETURNING *
//       `;
      
//       const updateResult = await client.query(updateQuery, updateValues);
//       const updatedOrder = updateResult.rows[0];
      
//       await client.query('COMMIT');
      
//       res.json({
//         message: 'Order updated successfully',
//         order: updatedOrder
//       });
//     } catch (err) {
//       await client.query('ROLLBACK');
//       console.error('Error updating order:', err);
//       res.status(500).json({ error: 'Server error' });
//     } finally {
//       client.release();
//     }
//   },

//   // Get order by ID (with proper authorization)
//   async getOrderById(req, res) {
//     const { orderId } = req.params;
    
//     try {
//       let query = `
//         SELECT o.*, u.name as user_name, u.email as user_email 
//         FROM orders o 
//         LEFT JOIN users u ON o.user_id = u.id 
//         WHERE o.id = $1
//       `;
      
//       const params = [orderId];
      
//       // If user is not admin, restrict to their own orders
//       if (req.user.role !== 'admin') {
//         query += ' AND o.user_id = $2';
//         params.push(req.user.id);
//       }
      
//       const result = await pool.query(query, params);
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Order not found' });
//       }
      
//       const order = result.rows[0];
      
//       // Get order items
//       const itemsResult = await pool.query(
//         `SELECT oi.*, p.name, p.image_url, p.emoji_icon, p.description
//          FROM order_items oi
//          JOIN products p ON oi.product_id = p.id
//          WHERE oi.order_id = $1`,
//         [orderId]
//       );
      
//       order.items = itemsResult.rows;
      
//       res.json(order);
//     } catch (err) {
//       console.error('Error fetching order:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = orderController;










// const { pool } = require('../config/database');

// const orderController = {
//   // Create order
//   async createOrder(req, res) {
//     const { delivery_address, delivery_phone, delivery_name, notes } = req.body;
//     const client = await pool.connect();
    
//     try {
//       await client.query('BEGIN');
      
//       const cartResult = await client.query(
//         `SELECT c.*, p.price, p.name
//          FROM cart c
//          JOIN products p ON c.product_id = p.id
//          WHERE c.user_id = $1`,
//         [req.user.id]
//       );
      
//       if (cartResult.rows.length === 0) {
//         await client.query('ROLLBACK');
//         return res.status(400).json({ error: 'Cart is empty' });
//       }
      
//       const totalAmount = cartResult.rows.reduce((sum, item) => 
//         sum + (parseFloat(item.price) * item.quantity), 0
//       );
      
//       const orderNumber = 'ORD-' + Date.now();
//       const orderResult = await client.query(
//         `INSERT INTO orders (order_number, user_id, total_amount, delivery_address, delivery_phone, delivery_name, notes)
//          VALUES ($1, $2, $3, $4, $5, $6, $7)
//          RETURNING *`,
//         [orderNumber, req.user.id, totalAmount, delivery_address, delivery_phone, delivery_name, notes]
//       );
      
//       const order = orderResult.rows[0];
      
//       for (const item of cartResult.rows) {
//         await client.query(
//           `INSERT INTO order_items (order_id, product_id, quantity, price)
//            VALUES ($1, $2, $3, $4)`,
//           [order.id, item.product_id, item.quantity, item.price]
//         );
//       }
      
//       await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);
      
//       const pointsEarned = Math.floor(totalAmount * 0.1);
//       await client.query(
//         `UPDATE users 
//          SET points = points + $1, 
//              total_orders = total_orders + 1,
//              membership_level = CASE
//                WHEN total_orders + 1 >= 50 THEN 'platinum'
//                WHEN total_orders + 1 >= 20 THEN 'gold'
//                WHEN total_orders + 1 >= 10 THEN 'silver'
//                ELSE 'bronze'
//              END
//          WHERE id = $2`,
//         [pointsEarned, req.user.id]
//       );
      
//       await client.query(
//         `INSERT INTO notifications (user_id, title, message, type)
//          VALUES ($1, $2, $3, $4)`,
//         [
//           req.user.id,
//           'تم تأكيد طلبك',
//           `تم استلام طلبك رقم ${orderNumber} بنجاح وسيتم التواصل معك قريباً`,
//           'order_confirmed'
//         ]
//       );
      
//       await client.query('COMMIT');
      
//       res.json({
//         message: 'Order created successfully',
//         order: order,
//         pointsEarned: pointsEarned
//       });
//     } catch (err) {
//       await client.query('ROLLBACK');
//       console.error('Error creating order:', err);
//       res.status(500).json({ error: 'Server error' });
//     } finally {
//       client.release();
//     }
//   },

//   // Get user's orders (for regular users) or all orders (for admins)
//   async getOrders(req, res) {
//     const { status, page = 1, limit = 10, user_id } = req.query;
//     const offset = (page - 1) * limit;
    
//     try {
//       let query, params;
      
//       // If user is admin and specific user_id is provided, get that user's orders
//       if (req.user.role === 'admin' && user_id) {
//         query = 'SELECT * FROM orders WHERE user_id = $1';
//         params = [user_id];
//       } 
//       // If user is admin and no user_id provided, get all orders
//       else if (req.user.role === 'admin') {
//         query = 'SELECT o.*, u.name as user_name, u.email as user_email FROM orders o LEFT JOIN users u ON o.user_id = u.id';
//         params = [];
//       } 
//       // Regular user gets only their own orders
//       else {
//         query = 'SELECT * FROM orders WHERE user_id = $1';
//         params = [req.user.id];
//       }
      
//       if (status) {
//         if (params.length === 0) {
//           query += ' WHERE status = $1';
//         } else {
//           query += ' AND status = $' + (params.length + 1);
//         }
//         params.push(status);
//       }
      
//       query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
//       params.push(limit, offset);
      
//       const result = await pool.query(query, params);
      
//       // Get order items for each order
//       for (const order of result.rows) {
//         const itemsResult = await pool.query(
//           `SELECT oi.*, p.name, p.image_url, p.emoji_icon
//            FROM order_items oi
//            JOIN products p ON oi.product_id = p.id
//            WHERE oi.order_id = $1`,
//           [order.id]
//         );
//         order.items = itemsResult.rows;
//       }
      
//       res.json(result.rows);
//     } catch (err) {
//       console.error('Error fetching orders:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Update order status (Admin only) - FIXED VERSION
//   async updateOrderStatus(req, res) {
//     const { orderId } = req.params;
//     const { status } = req.body; // Removed admin_notes since column doesn't exist
    
//     // Validate status
//     const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ 
//         error: 'Invalid status', 
//         validStatuses: validStatuses 
//       });
//     }
    
//     try {
//       // Get current order details
//       const orderResult = await pool.query(
//         'SELECT * FROM orders WHERE id = $1',
//         [orderId]
//       );
      
//       if (orderResult.rows.length === 0) {
//         return res.status(404).json({ error: 'Order not found' });
//       }
      
//       const order = orderResult.rows[0];
//       const oldStatus = order.status;
      
//       // Update order status - removed admin_notes reference
//       const updateResult = await pool.query(
//         `UPDATE orders 
//          SET status = $1, 
//              updated_at = CURRENT_TIMESTAMP
//          WHERE id = $2
//          RETURNING *`,
//         [status, orderId]
//       );
      
//       const updatedOrder = updateResult.rows[0];
      
//       // Create notification for user if status changed
//       if (oldStatus !== status) {
//         let notificationTitle, notificationMessage;
        
//         switch (status) {
//           case 'confirmed':
//             notificationTitle = 'تم تأكيد طلبك';
//             notificationMessage = `تم تأكيد طلبك رقم ${order.order_number}`;
//             break;
//           case 'preparing':
//             notificationTitle = 'جاري تحضير طلبك';
//             notificationMessage = `جاري تحضير طلبك رقم ${order.order_number}`;
//             break;
//           case 'shipped':
//             notificationTitle = 'تم شحن طلبك';
//             notificationMessage = `تم شحن طلبك رقم ${order.order_number} وهو في الطريق إليك`;
//             break;
//           case 'delivered':
//             notificationTitle = 'تم توصيل طلبك';
//             notificationMessage = `تم توصيل طلبك رقم ${order.order_number} بنجاح. شكراً لاختيارك!`;
//             break;
//           case 'cancelled':
//             notificationTitle = 'تم إلغاء طلبك';
//             notificationMessage = `تم إلغاء طلبك رقم ${order.order_number}`;
//             break;
//           default:
//             notificationTitle = 'تحديث على طلبك';
//             notificationMessage = `تم تحديث حالة طلبك رقم ${order.order_number} إلى ${status}`;
//         }
        
//         await pool.query(
//           `INSERT INTO notifications (user_id, title, message, type)
//            VALUES ($1, $2, $3, $4)`,
//           [order.user_id, notificationTitle, notificationMessage, 'order_updated']
//         );
//       }
      
//       res.json({
//         message: 'Order status updated successfully',
//         order: updatedOrder
//       });
//     } catch (err) {
//       console.error('Error updating order status:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Update order details (Admin only) - FIXED VERSION
//   async updateOrder(req, res) {
//     const { orderId } = req.params;
//     const { 
//       delivery_address, 
//       delivery_phone, 
//       delivery_name, 
//       notes,
//       total_amount 
//     } = req.body; // Removed admin_notes
    
//     try {
//       // Check if order exists
//       const orderResult = await pool.query(
//         'SELECT * FROM orders WHERE id = $1',
//         [orderId]
//       );
      
//       if (orderResult.rows.length === 0) {
//         return res.status(404).json({ error: 'Order not found' });
//       }
      
//       // Build dynamic update query - removed admin_notes
//       const updateFields = [];
//       const updateValues = [];
//       let paramCount = 1;
      
//       if (delivery_address !== undefined) {
//         updateFields.push(`delivery_address = $${paramCount}`);
//         updateValues.push(delivery_address);
//         paramCount++;
//       }
      
//       if (delivery_phone !== undefined) {
//         updateFields.push(`delivery_phone = $${paramCount}`);
//         updateValues.push(delivery_phone);
//         paramCount++;
//       }
      
//       if (delivery_name !== undefined) {
//         updateFields.push(`delivery_name = $${paramCount}`);
//         updateValues.push(delivery_name);
//         paramCount++;
//       }
      
//       if (notes !== undefined) {
//         updateFields.push(`notes = $${paramCount}`);
//         updateValues.push(notes);
//         paramCount++;
//       }
      
//       if (total_amount !== undefined) {
//         updateFields.push(`total_amount = $${paramCount}`);
//         updateValues.push(total_amount);
//         paramCount++;
//       }
      
//       if (updateFields.length === 0) {
//         return res.status(400).json({ error: 'No fields to update' });
//       }
      
//       updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
//       updateValues.push(orderId);
      
//       const updateQuery = `
//         UPDATE orders 
//         SET ${updateFields.join(', ')}
//         WHERE id = $${paramCount}
//         RETURNING *
//       `;
      
//       const updateResult = await pool.query(updateQuery, updateValues);
//       const updatedOrder = updateResult.rows[0];
      
//       res.json({
//         message: 'Order updated successfully',
//         order: updatedOrder
//       });
//     } catch (err) {
//       console.error('Error updating order:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Get order by ID (with proper authorization)
//   async getOrderById(req, res) {
//     const { orderId } = req.params;
    
//     try {
//       let query = `
//         SELECT o.*, u.name as user_name, u.email as user_email 
//         FROM orders o 
//         LEFT JOIN users u ON o.user_id = u.id 
//         WHERE o.id = $1
//       `;
      
//       const params = [orderId];
      
//       // If user is not admin, restrict to their own orders
//       if (req.user.role !== 'admin') {
//         query += ' AND o.user_id = $2';
//         params.push(req.user.id);
//       }
      
//       const result = await pool.query(query, params);
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Order not found' });
//       }
      
//       const order = result.rows[0];
      
//       // Get order items
//       const itemsResult = await pool.query(
//         `SELECT oi.*, p.name, p.image_url, p.emoji_icon, p.description
//          FROM order_items oi
//          JOIN products p ON oi.product_id = p.id
//          WHERE oi.order_id = $1`,
//         [orderId]
//       );
      
//       order.items = itemsResult.rows;
      
//       res.json(order);
//     } catch (err) {
//       console.error('Error fetching order:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = orderController;












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
      
      // First get current total_orders
      const userResult = await client.query(
        'SELECT total_orders FROM users WHERE id = $1',
        [req.user.id]
      );
      const currentTotalOrders = userResult.rows[0].total_orders || 0;
      const newTotalOrders = currentTotalOrders + 1;
      
      // Update user points and membership level
      await client.query(
        `UPDATE users 
         SET points = points + $1, 
             total_orders = $2,
             membership_level = CASE
               WHEN $2 >= 50 THEN 'platinum'
               WHEN $2 >= 20 THEN 'gold'
               WHEN $2 >= 10 THEN 'silver'
               ELSE 'bronze'
             END
         WHERE id = $3`,
        [pointsEarned, newTotalOrders, req.user.id]
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

  // Get user's orders (for regular users) or all orders (for admins) - FIXED VERSION
  async getOrders(req, res) {
    const { status, page = 1, limit = 10, user_id } = req.query;
    const offset = (page - 1) * limit;
    
    try {
      let query, params, countQuery, countParams;
      
      // If user is admin
      if (req.user.role === 'admin') {
        // If specific user_id is provided, get that user's orders
        if (user_id) {
          query = `
            SELECT o.*, u.name as user_name, u.email as user_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            WHERE o.user_id = $1
          `;
          countQuery = 'SELECT COUNT(*) FROM orders WHERE user_id = $1';
          params = [user_id];
          countParams = [user_id];
        } 
        // If no user_id provided, get all orders for all users
        else {
          query = `
            SELECT o.*, u.name as user_name, u.email as user_email 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id
          `;
          countQuery = 'SELECT COUNT(*) FROM orders';
          params = [];
          countParams = [];
        }
      } 
      // Regular user gets only their own orders
      else {
        query = `
          SELECT o.*, u.name as user_name, u.email as user_email 
          FROM orders o 
          LEFT JOIN users u ON o.user_id = u.id 
          WHERE o.user_id = $1
        `;
        countQuery = 'SELECT COUNT(*) FROM orders WHERE user_id = $1';
        params = [req.user.id];
        countParams = [req.user.id];
      }
      
      // Add status filter if provided
      if (status) {
        const statusCondition = 'status = $' + (params.length + 1);
        
        if (params.length === 0) {
          query += ' WHERE ' + statusCondition;
          countQuery += ' WHERE ' + statusCondition;
        } else {
          query += ' AND ' + statusCondition;
          countQuery += ' AND ' + statusCondition;
        }
        
        params.push(status);
        countParams.push(status);
      }
      
      // Add ordering and pagination
      query += ' ORDER BY o.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(parseInt(limit), offset);
      
      // Execute queries
      const result = await pool.query(query, params);
      const countResult = await pool.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);
      const totalPages = Math.ceil(totalCount / limit);
      
      // Get order items for each order
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
      
      res.json({
        orders: result.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: totalPages,
          totalOrders: totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update order status (Admin only)
  async updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status', 
        validStatuses: validStatuses 
      });
    }
    
    try {
      // Get current order details
      const orderResult = await pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [orderId]
      );
      
      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const order = orderResult.rows[0];
      const oldStatus = order.status;
      
      // Update order status
      const updateResult = await pool.query(
        `UPDATE orders 
         SET status = $1, 
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, orderId]
      );
      
      const updatedOrder = updateResult.rows[0];
      
      // Create notification for user if status changed
      if (oldStatus !== status) {
        let notificationTitle, notificationMessage;
        
        switch (status) {
          case 'confirmed':
            notificationTitle = 'تم تأكيد طلبك';
            notificationMessage = `تم تأكيد طلبك رقم ${order.order_number}`;
            break;
          case 'preparing':
            notificationTitle = 'جاري تحضير طلبك';
            notificationMessage = `جاري تحضير طلبك رقم ${order.order_number}`;
            break;
          case 'shipped':
            notificationTitle = 'تم شحن طلبك';
            notificationMessage = `تم شحن طلبك رقم ${order.order_number} وهو في الطريق إليك`;
            break;
          case 'delivered':
            notificationTitle = 'تم توصيل طلبك';
            notificationMessage = `تم توصيل طلبك رقم ${order.order_number} بنجاح. شكراً لاختيارك!`;
            
            // Add points when order is delivered
            const pointsEarned = Math.floor(order.total_amount * 0.1);
            await pool.query(
              'UPDATE users SET points = points + $1 WHERE id = $2',
              [pointsEarned, order.user_id]
            );
            break;
          case 'cancelled':
            notificationTitle = 'تم إلغاء طلبك';
            notificationMessage = `تم إلغاء طلبك رقم ${order.order_number}`;
            break;
          default:
            notificationTitle = 'تحديث على طلبك';
            notificationMessage = `تم تحديث حالة طلبك رقم ${order.order_number} إلى ${status}`;
        }
        
        await pool.query(
          `INSERT INTO notifications (user_id, title, message, type)
           VALUES ($1, $2, $3, $4)`,
          [order.user_id, notificationTitle, notificationMessage, 'order_updated']
        );
      }
      
      res.json({
        message: 'Order status updated successfully',
        order: updatedOrder
      });
    } catch (err) {
      console.error('Error updating order status:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update order details (Admin only)
  async updateOrder(req, res) {
    const { orderId } = req.params;
    const { 
      delivery_address, 
      delivery_phone, 
      delivery_name, 
      notes,
      total_amount 
    } = req.body;
    
    try {
      // Check if order exists
      const orderResult = await pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [orderId]
      );
      
      if (orderResult.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      // Build dynamic update query
      const updateFields = [];
      const updateValues = [];
      let paramCount = 1;
      
      if (delivery_address !== undefined) {
        updateFields.push(`delivery_address = $${paramCount}`);
        updateValues.push(delivery_address);
        paramCount++;
      }
      
      if (delivery_phone !== undefined) {
        updateFields.push(`delivery_phone = $${paramCount}`);
        updateValues.push(delivery_phone);
        paramCount++;
      }
      
      if (delivery_name !== undefined) {
        updateFields.push(`delivery_name = $${paramCount}`);
        updateValues.push(delivery_name);
        paramCount++;
      }
      
      if (notes !== undefined) {
        updateFields.push(`notes = $${paramCount}`);
        updateValues.push(notes);
        paramCount++;
      }
      
      if (total_amount !== undefined) {
        updateFields.push(`total_amount = $${paramCount}`);
        updateValues.push(parseFloat(total_amount));
        paramCount++;
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateValues.push(orderId);
      
      const updateQuery = `
        UPDATE orders 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;
      
      const updateResult = await pool.query(updateQuery, updateValues);
      const updatedOrder = updateResult.rows[0];
      
      res.json({
        message: 'Order updated successfully',
        order: updatedOrder
      });
    } catch (err) {
      console.error('Error updating order:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get order by ID (with proper authorization)
  async getOrderById(req, res) {
    const { orderId } = req.params;
    
    try {
      let query = `
        SELECT o.*, u.name as user_name, u.email as user_email 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        WHERE o.id = $1
      `;
      
      const params = [orderId];
      
      // If user is not admin, restrict to their own orders
      if (req.user.role !== 'admin') {
        query += ' AND o.user_id = $2';
        params.push(req.user.id);
      }
      
      const result = await pool.query(query, params);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      const order = result.rows[0];
      
      // Get order items
      const itemsResult = await pool.query(
        `SELECT oi.*, p.name, p.image_url, p.emoji_icon, p.description
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [orderId]
      );
      
      order.items = itemsResult.rows;
      
      res.json(order);
    } catch (err) {
      console.error('Error fetching order:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = orderController;