const { pool } = require('../config/database');
const { redisClient } = require('../config/redis');
const upload = require('../config/multer');

// Helper functions for cache
async function getFromCache(key) {
  if (!redisClient) return null;
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (err) {
    console.error('Redis get error:', err);
    return null;
  }
}

async function setToCache(key, data, expiry = 3600) {
  if (!redisClient) return;
  try {
    await redisClient.setEx(key, expiry, JSON.stringify(data));
  } catch (err) {
    console.error('Redis set error:', err);
  }
}

async function deleteFromCache(key) {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis delete error:', err);
  }
}

const productController = {
  // Create new product (Admin only)
  async createProduct(req, res) {
    const { 
      name, 
      name_ar, 
      brand, 
      price, 
      original_price, 
      description, 
      description_ar, 
      category_id, 
      emoji_icon, 
      in_stock = true, 
      discount = 0, 
      badge 
    } = req.body;

    // Validation
    if (!name || !name_ar || !price || !category_id) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'يجب إدخال جميع الحقول المطلوبة (الاسم، الاسم العربي، السعر، التصنيف)'
      });
    }

    if (price < 0) {
      return res.status(400).json({ 
        error: 'Invalid price',
        message: 'السعر يجب أن يكون رقم موجب'
      });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({ 
        error: 'Invalid discount',
        message: 'الخصم يجب أن يكون بين 0 و 100'
      });
    }

    const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

    try {
      // Check if category exists
      const categoryCheck = await pool.query(
        'SELECT id FROM categories WHERE id = $1',
        [category_id]
      );

      if (categoryCheck.rows.length === 0) {
        return res.status(400).json({ 
          error: 'Category not found',
          message: 'التصنيف غير موجود'
        });
      }

      const result = await pool.query(
        `INSERT INTO products (
          name, name_ar, brand, price, original_price, description, 
          description_ar, category_id, image_url, emoji_icon, 
          in_stock, discount, badge
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          name, name_ar, brand, price, original_price, description,
          description_ar, category_id, image_url, emoji_icon,
          in_stock, discount, badge
        ]
      );

      // Update category product count
      await pool.query(
        'UPDATE categories SET product_count = product_count + 1 WHERE id = $1',
        [category_id]
      );

      // Clear relevant caches
      await deleteFromCache('categories:all');
      await deleteFromCache('products:all');

      res.status(201).json({
        message: 'Product created successfully',
        message_ar: 'تم إنشاء المنتج بنجاح',
        product: result.rows[0]
      });
    } catch (err) {
      console.error('Error creating product:', err);
      
      // Handle specific errors
      if (err.code === '23503') { // Foreign key violation
        return res.status(400).json({ 
          error: 'Invalid category',
          message: 'التصنيف غير صحيح'
        });
      }
      
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update product (Admin only)
  async updateProduct(req, res) {
    const { id } = req.params;
    const {
      name, name_ar, brand, price, original_price, description,
      description_ar, category_id, emoji_icon, in_stock, discount, badge
    } = req.body;

    const image_url = req.file ? `/uploads/products/${req.file.filename}` : undefined;

    try {
      let query = `
        UPDATE products SET 
          name = COALESCE($1, name),
          name_ar = COALESCE($2, name_ar),
          brand = COALESCE($3, brand),
          price = COALESCE($4, price),
          original_price = COALESCE($5, original_price),
          description = COALESCE($6, description),
          description_ar = COALESCE($7, description_ar),
          category_id = COALESCE($8, category_id),
          emoji_icon = COALESCE($9, emoji_icon),
          in_stock = COALESCE($10, in_stock),
          discount = COALESCE($11, discount),
          badge = COALESCE($12, badge),
          updated_at = CURRENT_TIMESTAMP
      `;

      const params = [
        name, name_ar, brand, price, original_price, description,
        description_ar, category_id, emoji_icon, in_stock, discount, badge
      ];

      // Add image_url to update if provided
      if (image_url) {
        query += ', image_url = $13';
        params.push(image_url);
      }

      query += ` WHERE id = $${params.length + 1} RETURNING *`;
      params.push(id);

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Product not found',
          message: 'المنتج غير موجود'
        });
      }

      // Clear caches
      await deleteFromCache(`product:${id}`);
      await deleteFromCache('products:all');
      await deleteFromCache('categories:all');

      res.json({
        message: 'Product updated successfully',
        message_ar: 'تم تحديث المنتج بنجاح',
        product: result.rows[0]
      });
    } catch (err) {
      console.error('Error updating product:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete product (Admin only)
  async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      // Get product info before deletion for category update
      const productResult = await pool.query(
        'SELECT category_id FROM products WHERE id = $1',
        [id]
      );

      if (productResult.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Product not found',
          message: 'المنتج غير موجود'
        });
      }

      const category_id = productResult.rows[0].category_id;

      // Delete the product
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );

      // Update category product count
      await pool.query(
        'UPDATE categories SET product_count = GREATEST(0, product_count - 1) WHERE id = $1',
        [category_id]
      );

      // Clear caches
      await deleteFromCache(`product:${id}`);
      await deleteFromCache('products:all');
      await deleteFromCache('categories:all');

      res.json({
        message: 'Product deleted successfully',
        message_ar: 'تم حذف المنتج بنجاح',
        product: result.rows[0]
      });
    } catch (err) {
      console.error('Error deleting product:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get all products with filters
  async getProducts(req, res) {
    const { category, search, inStock, minPrice, maxPrice, sortBy, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
      let query = `
        SELECT p.*, c.name as category_name, c.name_ar as category_name_ar 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE 1=1
      `;
      const params = [];
      let paramCount = 0;
      
      if (category) {
        params.push(category);
        query += ` AND p.category_id = $${++paramCount}`;
      }
      
      if (search) {
        params.push(`%${search}%`);
        query += ` AND (p.name ILIKE $${++paramCount} OR p.name_ar ILIKE $${paramCount} OR p.brand ILIKE $${paramCount})`;
      }
      
      if (inStock === 'true') {
        query += ' AND p.in_stock = true';
      }
      
      if (minPrice) {
        params.push(minPrice);
        query += ` AND p.price >= $${++paramCount}`;
      }
      
      if (maxPrice) {
        params.push(maxPrice);
        query += ` AND p.price <= $${++paramCount}`;
      }
      
      // Sorting
      switch (sortBy) {
        case 'price_asc':
          query += ' ORDER BY p.price ASC';
          break;
        case 'price_desc':
          query += ' ORDER BY p.price DESC';
          break;
        case 'rating':
          query += ' ORDER BY p.rating DESC';
          break;
        case 'newest':
          query += ' ORDER BY p.created_at DESC';
          break;
        case 'discount':
          query += ' ORDER BY p.discount DESC';
          break;
        default:
          query += ' ORDER BY p.id DESC';
      }
      
      params.push(limit, offset);
      query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
      
      const result = await pool.query(query, params);
      
      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) FROM products WHERE 1=1';
      const countParams = [];
      
      if (category) {
        countParams.push(category);
        countQuery += ' AND category_id = $1';
      }
      
      if (search) {
        countParams.push(`%${search}%`);
        countQuery += ` AND (name ILIKE $${category ? 2 : 1} OR name_ar ILIKE $${category ? 2 : 1} OR brand ILIKE $${category ? 2 : 1})`;
      }
      
      if (inStock === 'true') {
        countQuery += ' AND in_stock = true';
      }
      
      const countResult = await pool.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);
      
      res.json({
        products: result.rows,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get single product
  async getProduct(req, res) {
    const { id } = req.params;
    
    try {
      const cacheKey = `product:${id}`;
      
      const cached = await getFromCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }
      
      const result = await pool.query(
        `SELECT p.*, c.name as category_name, c.name_ar as category_name_ar
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.id = $1`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const product = result.rows[0];
      
      // Get reviews
      const reviewsResult = await pool.query(
        `SELECT r.*, u.name as user_name 
         FROM reviews r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.product_id = $1 
         ORDER BY r.created_at DESC 
         LIMIT 10`,
        [id]
      );
      
      product.reviews = reviewsResult.rows;
      
      await setToCache(cacheKey, product, 300);
      
      res.json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get featured products
  async getFeaturedProducts(req, res) {
    try {
      const result = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.in_stock = true 
        ORDER BY p.rating DESC, p.discount DESC, p.created_at DESC 
        LIMIT 12
      `);
      
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get products on sale
  async getProductsOnSale(req, res) {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    try {
      const result = await pool.query(`
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.discount > 0 AND p.in_stock = true 
        ORDER BY p.discount DESC 
        LIMIT $1 OFFSET $2
      `, [limit, offset]);
      
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM products WHERE discount > 0 AND in_stock = true'
      );
      const totalCount = parseInt(countResult.rows[0].count);
      
      res.json({
        products: result.rows,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (err) {
      console.error('Error fetching products on sale:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Search products
  async searchProducts(req, res) {
    const { q, category, minPrice, maxPrice, inStock, sortBy, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    try {
      let query = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE (p.name ILIKE $1 OR p.name_ar ILIKE $1 OR p.brand ILIKE $1 OR p.description ILIKE $1)
      `;
      const params = [`%${q}%`];
      let paramCount = 1;
      
      if (category) {
        params.push(category);
        query += ` AND p.category_id = $${++paramCount}`;
      }
      
      if (minPrice) {
        params.push(minPrice);
        query += ` AND p.price >= $${++paramCount}`;
      }
      
      if (maxPrice) {
        params.push(maxPrice);
        query += ` AND p.price <= $${++paramCount}`;
      }
      
      if (inStock === 'true') {
        query += ' AND p.in_stock = true';
      }
      
      // Sorting
      switch (sortBy) {
        case 'price_asc':
          query += ' ORDER BY p.price ASC';
          break;
        case 'price_desc':
          query += ' ORDER BY p.price DESC';
          break;
        case 'rating':
          query += ' ORDER BY p.rating DESC';
          break;
        case 'relevance':
        default:
          query += ' ORDER BY p.rating DESC, p.created_at DESC';
      }
      
      params.push(limit, offset);
      query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
      
      const result = await pool.query(query, params);
      
      // Count query
      let countQuery = `
        SELECT COUNT(*) 
        FROM products 
        WHERE (name ILIKE $1 OR name_ar ILIKE $1 OR brand ILIKE $1 OR description ILIKE $1)
      `;
      const countParams = [`%${q}%`];
      
      if (category) {
        countParams.push(category);
        countQuery += ` AND category_id = $${countParams.length}`;
      }
      
      const countResult = await pool.query(countQuery, countParams);
      const totalCount = parseInt(countResult.rows[0].count);
      
      res.json({
        query: q,
        products: result.rows,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (err) {
      console.error('Error searching products:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = productController;