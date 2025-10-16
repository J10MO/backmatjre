const { pool } = require('../config/database');
const { redisClient } = require('../config/redis');

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

async function setToCache(key, data, expiry = 1800) {
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

const favoriteController = {
  // إضافة منتج إلى المفضلة
  async addToFavorites(req, res) {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
      // التحقق من وجود المنتج
      const productCheck = await pool.query(
        'SELECT id, name, name_ar, image_url, price, discount FROM products WHERE id = $1 AND in_stock = true',
        [productId]
      );

      if (productCheck.rows.length === 0) {
        return res.status(404).json({
          error: 'Product not found',
          message: 'المنتج غير موجود أو غير متوفر'
        });
      }

      // التحقق من عدم وجود المنتج في المفضلة مسبقاً
      const existingFavorite = await pool.query(
        'SELECT id FROM favorites WHERE user_id = $1 AND product_id = $2',
        [userId, productId]
      );

      if (existingFavorite.rows.length > 0) {
        return res.status(400).json({
          error: 'Product already in favorites',
          message: 'المنتج موجود بالفعل في المفضلة'
        });
      }

      // إضافة المنتج إلى المفضلة
      const result = await pool.query(
        `INSERT INTO favorites (user_id, product_id) 
         VALUES ($1, $2) 
         RETURNING *`,
        [userId, productId]
      );

      // مسح الكاش الخاص بقائمة مفضلات المستخدم
      await deleteFromCache(`favorites:user:${userId}`);
      await deleteFromCache(`favorites:count:${userId}`);

      res.status(201).json({
        message: 'Product added to favorites',
        message_ar: 'تم إضافة المنتج إلى المفضلة',
        favorite: result.rows[0],
        product: productCheck.rows[0]
      });

    } catch (err) {
      console.error('Error adding to favorites:', err);
      
      if (err.code === '23503') {
        return res.status(400).json({
          error: 'Invalid product',
          message: 'المنتج غير صحيح'
        });
      }
      
      res.status(500).json({ 
        error: 'Server error',
        message: 'حدث خطأ في الخادم'
      });
    }
  },

  // إزالة منتج من المفضلة
  async removeFromFavorites(req, res) {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
      const result = await pool.query(
        `DELETE FROM favorites 
         WHERE user_id = $1 AND product_id = $2 
         RETURNING *`,
        [userId, productId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: 'Favorite not found',
          message: 'المنتج غير موجود في المفضلة'
        });
      }

      // مسح الكاش الخاص بقائمة مفضلات المستخدم
      await deleteFromCache(`favorites:user:${userId}`);
      await deleteFromCache(`favorites:count:${userId}`);

      res.json({
        message: 'Product removed from favorites',
        message_ar: 'تم إزالة المنتج من المفضلة',
        favorite: result.rows[0]
      });

    } catch (err) {
      console.error('Error removing from favorites:', err);
      res.status(500).json({ 
        error: 'Server error',
        message: 'حدث خطأ في الخادم'
      });
    }
  },

  // الحصول على قائمة المفضلات للمستخدم
  async getFavorites(req, res) {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    try {
      const cacheKey = `favorites:user:${userId}:page_${page}_limit_${limit}`;
      
      // محاولة جلب البيانات من الكاش
      const cached = await getFromCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      // جلب عدد المنتجات في المفضلة
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM favorites WHERE user_id = $1',
        [userId]
      );
      const totalCount = parseInt(countResult.rows[0].count);

      // جلب المنتجات المفضلة مع معلومات المنتج
      const result = await pool.query(
        `SELECT 
           p.*,
           f.created_at as favorited_at,
           c.name as category_name,
           c.name_ar as category_name_ar
         FROM favorites f
         JOIN products p ON f.product_id = p.id
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE f.user_id = $1 AND p.in_stock = true
         ORDER BY f.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, parseInt(limit), offset]
      );

      const response = {
        favorites: result.rows,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      };

      // حفظ في الكاش
      await setToCache(cacheKey, response, 1800);

      res.json(response);

    } catch (err) {
      console.error('Error fetching favorites:', err);
      res.status(500).json({ 
        error: 'Server error',
        message: 'حدث خطأ في الخادم'
      });
    }
  },

  // التحقق مما إذا كان المنتج في المفضلة
  async checkFavorite(req, res) {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
      const result = await pool.query(
        `SELECT f.id, f.created_at, p.name, p.name_ar 
         FROM favorites f
         JOIN products p ON f.product_id = p.id
         WHERE f.user_id = $1 AND f.product_id = $2`,
        [userId, productId]
      );

      const isFavorite = result.rows.length > 0;

      res.json({
        isFavorite,
        favorite: isFavorite ? result.rows[0] : null
      });

    } catch (err) {
      console.error('Error checking favorite:', err);
      res.status(500).json({ 
        error: 'Server error',
        message: 'حدث خطأ في الخادم'
      });
    }
  },

  // الحصول على عدد المنتجات في المفضلة
  async getFavoritesCount(req, res) {
    const userId = req.user.id;

    try {
      const cacheKey = `favorites:count:${userId}`;
      
      const cached = await getFromCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }

      const result = await pool.query(
        'SELECT COUNT(*) FROM favorites WHERE user_id = $1',
        [userId]
      );

      const count = parseInt(result.rows[0].count);

      const response = { count };
      
      await setToCache(cacheKey, response, 1800);

      res.json(response);

    } catch (err) {
      console.error('Error fetching favorites count:', err);
      res.status(500).json({ 
        error: 'Server error',
        message: 'حدث خطأ في الخادم'
      });
    }
  }
};

module.exports = favoriteController;