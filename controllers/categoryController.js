// const { pool } = require('../config/database');
// const { redisClient } = require('../config/redis');

// // Helper functions for cache
// async function deleteFromCache(key) {
//   if (!redisClient) return;
//   try {
//     await redisClient.del(key);
//   } catch (err) {
//     console.error('Redis delete error:', err);
//   }
// }

// async function getFromCache(key) {
//   if (!redisClient) return null;
//   try {
//     const cached = await redisClient.get(key);
//     return cached ? JSON.parse(cached) : null;
//   } catch (err) {
//     console.error('Redis get error:', err);
//     return null;
//   }
// }

// async function setToCache(key, data, expiry = 3600) {
//   if (!redisClient) return;
//   try {
//     await redisClient.setEx(key, expiry, JSON.stringify(data));
//   } catch (err) {
//     console.error('Redis set error:', err);
//   }
// }

// const categoryController = {
//   // Get all categories
//   async getCategories(req, res) {
//     try {
//       const cacheKey = 'categories:all';
      
//       // Check cache first
//       const cached = await getFromCache(cacheKey);
//       if (cached) {
//         return res.json(cached);
//       }
      
//       const result = await pool.query(`
//         SELECT c.*, 
//                COUNT(p.id) as product_count
//         FROM categories c
//         LEFT JOIN products p ON c.id = p.category_id
//         GROUP BY c.id
//         ORDER BY c.id
//       `);
      
//       const categories = result.rows;
      
//       // Store in cache
//       await setToCache(cacheKey, categories, 3600);
      
//       res.json(categories);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Create new category (Admin only)
//   async createCategory(req, res) {
//     const { name, name_ar, icon, color } = req.body;

//     if (!name || !name_ar) {
//       return res.status(400).json({ 
//         error: 'Name and Arabic name are required',
//         message: 'يجب إدخال اسم التصنيف باللغتين الإنجليزية والعربية'
//       });
//     }

//     try {
//       const result = await pool.query(
//         `INSERT INTO categories (name, name_ar, icon, color) 
//          VALUES ($1, $2, $3, $4) 
//          RETURNING *`,
//         [name, name_ar, icon || null, color || null]
//       );

//       // Clear categories cache
//       await deleteFromCache('categories:all');

//       res.status(201).json({ 
//         message: 'Category created successfully',
//         message_ar: 'تم إنشاء التصنيف بنجاح',
//         category: result.rows[0] 
//       });
//     } catch (err) {
//       console.error('Error creating category:', err);
//       if (err.code === '23505') { // Unique constraint violation
//         res.status(400).json({ 
//           error: 'Category already exists',
//           message: 'التصنيف موجود مسبقاً'
//         });
//       } else {
//         res.status(500).json({ error: 'Server error' });
//       }
//     }
//   },

//   // Get single category
//   async getCategory(req, res) {
//     const { id } = req.params;
    
//     try {
//       const result = await pool.query(
//         `SELECT c.*, 
//                 COUNT(p.id) as product_count
//          FROM categories c
//          LEFT JOIN products p ON c.id = p.category_id
//          WHERE c.id = $1
//          GROUP BY c.id`,
//         [id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error fetching category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Update category (Admin only)
//   async updateCategory(req, res) {
//     const { id } = req.params;
//     const { name, name_ar, icon, color } = req.body;
    
//     try {
//       const result = await pool.query(
//         `UPDATE categories 
//          SET name = COALESCE($1, name),
//              name_ar = COALESCE($2, name_ar),
//              icon = COALESCE($3, icon),
//              color = COALESCE($4, color)
//          WHERE id = $5
//          RETURNING *`,
//         [name, name_ar, icon, color, id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       // Clear cache
//       await deleteFromCache('categories:all');
      
//       res.json({ 
//         message: 'Category updated successfully',
//         message_ar: 'تم تحديث التصنيف بنجاح',
//         category: result.rows[0] 
//       });
//     } catch (err) {
//       console.error('Error updating category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Delete category (Admin only)
//   async deleteCategory(req, res) {
//     const { id } = req.params;
    
//     try {
//       // Check if category has products
//       const productsCheck = await pool.query(
//         'SELECT COUNT(*) FROM products WHERE category_id = $1',
//         [id]
//       );
      
//       if (parseInt(productsCheck.rows[0].count) > 0) {
//         return res.status(400).json({ 
//           error: 'Cannot delete category with products',
//           message: 'لا يمكن حذف التصنيف لأنه يحتوي على منتجات'
//         });
//       }
      
//       const result = await pool.query(
//         'DELETE FROM categories WHERE id = $1 RETURNING *',
//         [id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       // Clear cache
//       await deleteFromCache('categories:all');
      
//       res.json({ 
//         message: 'Category deleted successfully',
//         message_ar: 'تم حذف التصنيف بنجاح'
//       });
//     } catch (err) {
//       console.error('Error deleting category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Get category products
//   async getCategoryProducts(req, res) {
//     const { id } = req.params;
//     const { page = 1, limit = 20, sortBy } = req.query;
//     const offset = (page - 1) * limit;
    
//     try {
//       // Verify category exists
//       const categoryCheck = await pool.query(
//         'SELECT id, name, name_ar FROM categories WHERE id = $1',
//         [id]
//       );
      
//       if (categoryCheck.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       let query = `
//         SELECT p.* 
//         FROM products p 
//         WHERE p.category_id = $1 AND p.in_stock = true
//       `;
//       const params = [id];
      
//       // Sorting
//       switch (sortBy) {
//         case 'price_asc':
//           query += ' ORDER BY p.price ASC';
//           break;
//         case 'price_desc':
//           query += ' ORDER BY p.price DESC';
//           break;
//         case 'rating':
//           query += ' ORDER BY p.rating DESC';
//           break;
//         case 'newest':
//           query += ' ORDER BY p.created_at DESC';
//           break;
//         default:
//           query += ' ORDER BY p.id';
//       }
      
//       query += ` LIMIT $2 OFFSET $3`;
//       params.push(limit, offset);
      
//       const result = await pool.query(query, params);
      
//       // Get total count
//       const countResult = await pool.query(
//         'SELECT COUNT(*) FROM products WHERE category_id = $1 AND in_stock = true',
//         [id]
//       );
//       const totalCount = parseInt(countResult.rows[0].count);
      
//       res.json({
//         category: categoryCheck.rows[0],
//         products: result.rows,
//         pagination: {
//           total: totalCount,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(totalCount / limit)
//         }
//       });
//     } catch (err) {
//       console.error('Error fetching category products:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = categoryController;




// const { pool } = require('../config/database');
// const { redisClient } = require('../config/redis');

// // Helper functions for cache
// async function deleteFromCache(key) {
//   if (!redisClient) return;
//   try {
//     await redisClient.del(key);
//   } catch (err) {
//     console.error('Redis delete error:', err);
//   }
// }

// async function getFromCache(key) {
//   if (!redisClient) return null;
//   try {
//     const cached = await redisClient.get(key);
//     return cached ? JSON.parse(cached) : null;
//   } catch (err) {
//     console.error('Redis get error:', err);
//     return null;
//   }
// }

// async function setToCache(key, data, expiry = 3600) {
//   if (!redisClient) return;
//   try {
//     await redisClient.setEx(key, expiry, JSON.stringify(data));
//   } catch (err) {
//     console.error('Redis set error:', err);
//   }
// }

// const categoryController = {
//   // Get all categories
//   async getCategories(req, res) {
//     try {
//       const cacheKey = 'categories:all';
      
//       // Check cache first
//       const cached = await getFromCache(cacheKey);
//       if (cached) {
//         return res.json(cached);
//       }
      
//       const result = await pool.query(`
//         SELECT c.*, 
//                COUNT(p.id) as product_count
//         FROM categories c
//         LEFT JOIN products p ON c.id = p.category_id
//         GROUP BY c.id
//         ORDER BY c.id
//       `);
      
//       const categories = result.rows;
      
//       // Store in cache
//       await setToCache(cacheKey, categories, 3600);
      
//       res.json(categories);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Create new category (Admin only)
//   async createCategory(req, res) {
//     const { name, name_ar, icon, color, image_url } = req.body;

//     if (!name || !name_ar) {
//       return res.status(400).json({ 
//         error: 'Name and Arabic name are required',
//         message: 'يجب إدخال اسم التصنيف باللغتين الإنجليزية والعربية'
//       });
//     }

//     try {
//       const result = await pool.query(
//         `INSERT INTO categories (name, name_ar, icon, color, image_url) 
//          VALUES ($1, $2, $3, $4, $5) 
//          RETURNING *`,
//         [name, name_ar, icon || null, color || null, image_url || null]
//       );

//       // Clear categories cache
//       await deleteFromCache('categories:all');

//       res.status(201).json({ 
//         message: 'Category created successfully',
//         message_ar: 'تم إنشاء التصنيف بنجاح',
//         category: result.rows[0] 
//       });
//     } catch (err) {
//       console.error('Error creating category:', err);
//       if (err.code === '23505') {
//         res.status(400).json({ 
//           error: 'Category already exists',
//           message: 'التصنيف موجود مسبقاً'
//         });
//       } else {
//         res.status(500).json({ error: 'Server error' });
//       }
//     }
//   },

//   // Get single category
//   async getCategory(req, res) {
//     const { id } = req.params;
    
//     try {
//       const result = await pool.query(
//         `SELECT c.*, 
//                 COUNT(p.id) as product_count
//          FROM categories c
//          LEFT JOIN products p ON c.id = p.category_id
//          WHERE c.id = $1
//          GROUP BY c.id`,
//         [id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error fetching category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Update category (Admin only)
//   async updateCategory(req, res) {
//     const { id } = req.params;
//     const { name, name_ar, icon, color, image_url } = req.body;
    
//     try {
//       const result = await pool.query(
//         `UPDATE categories 
//          SET name = COALESCE($1, name),
//              name_ar = COALESCE($2, name_ar),
//              icon = COALESCE($3, icon),
//              color = COALESCE($4, color),
//              image_url = COALESCE($5, image_url)
//          WHERE id = $6
//          RETURNING *`,
//         [name, name_ar, icon, color, image_url, id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       // Clear cache
//       await deleteFromCache('categories:all');
      
//       res.json({ 
//         message: 'Category updated successfully',
//         message_ar: 'تم تحديث التصنيف بنجاح',
//         category: result.rows[0] 
//       });
//     } catch (err) {
//       console.error('Error updating category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Delete category (Admin only)
//   async deleteCategory(req, res) {
//     const { id } = req.params;
    
//     try {
//       // Check if category has products
//       const productsCheck = await pool.query(
//         'SELECT COUNT(*) FROM products WHERE category_id = $1',
//         [id]
//       );
      
//       if (parseInt(productsCheck.rows[0].count) > 0) {
//         return res.status(400).json({ 
//           error: 'Cannot delete category with products',
//           message: 'لا يمكن حذف التصنيف لأنه يحتوي على منتجات'
//         });
//       }
      
//       const result = await pool.query(
//         'DELETE FROM categories WHERE id = $1 RETURNING *',
//         [id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       // Clear cache
//       await deleteFromCache('categories:all');
      
//       res.json({ 
//         message: 'Category deleted successfully',
//         message_ar: 'تم حذف التصنيف بنجاح'
//       });
//     } catch (err) {
//       console.error('Error deleting category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Get category products
//   async getCategoryProducts(req, res) {
//     const { id } = req.params;
//     const { page = 1, limit = 20, sortBy } = req.query;
//     const offset = (page - 1) * limit;
    
//     try {
//       // Verify category exists
//       const categoryCheck = await pool.query(
//         'SELECT id, name, name_ar FROM categories WHERE id = $1',
//         [id]
//       );
      
//       if (categoryCheck.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       let query = `
//         SELECT p.* 
//         FROM products p 
//         WHERE p.category_id = $1 AND p.in_stock = true
//       `;
//       const params = [id];
      
//       // Sorting
//       switch (sortBy) {
//         case 'price_asc':
//           query += ' ORDER BY p.price ASC';
//           break;
//         case 'price_desc':
//           query += ' ORDER BY p.price DESC';
//           break;
//         case 'rating':
//           query += ' ORDER BY p.rating DESC';
//           break;
//         case 'newest':
//           query += ' ORDER BY p.created_at DESC';
//           break;
//         default:
//           query += ' ORDER BY p.id';
//       }
      
//       query += ` LIMIT $2 OFFSET $3`;
//       params.push(limit, offset);
      
//       const result = await pool.query(query, params);
      
//       // Get total count
//       const countResult = await pool.query(
//         'SELECT COUNT(*) FROM products WHERE category_id = $1 AND in_stock = true',
//         [id]
//       );
//       const totalCount = parseInt(countResult.rows[0].count);
      
//       res.json({
//         category: categoryCheck.rows[0],
//         products: result.rows,
//         pagination: {
//           total: totalCount,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(totalCount / limit)
//         }
//       });
//     } catch (err) {
//       console.error('Error fetching category products:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = categoryController;






// const { pool } = require('../config/database');
// const { redisClient } = require('../config/redis');

// // Helper functions for cache
// async function deleteFromCache(key) {
//   if (!redisClient) return;
//   try {
//     await redisClient.del(key);
//   } catch (err) {
//     console.error('Redis delete error:', err);
//   }
// }

// async function getFromCache(key) {
//   if (!redisClient) return null;
//   try {
//     const cached = await redisClient.get(key);
//     return cached ? JSON.parse(cached) : null;
//   } catch (err) {
//     console.error('Redis get error:', err);
//     return null;
//   }
// }

// async function setToCache(key, data, expiry = 3600) {
//   if (!redisClient) return;
//   try {
//     await redisClient.setEx(key, expiry, JSON.stringify(data));
//   } catch (err) {
//     console.error('Redis set error:', err);
//   }
// }

// const categoryController = {
//   // Get all categories
//   async getCategories(req, res) {
//     try {
//       const cacheKey = 'categories:all';
      
//       // Check cache first
//       const cached = await getFromCache(cacheKey);
//       if (cached) {
//         return res.json(cached);
//       }
      
//       const result = await pool.query(`
//         SELECT c.*, 
//                COUNT(p.id) as product_count
//         FROM categories c
//         LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
//         GROUP BY c.id
//         ORDER BY c.id
//       `);
      
//       const categories = result.rows;
      
//       // Store in cache
//       await setToCache(cacheKey, categories, 3600);
      
//       res.json(categories);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Create new category (Admin only) - UPDATED FOR FILE UPLOAD
//   async createCategory(req, res) {
//     try {
//       const { name, name_ar, icon, color } = req.body;

//       if (!name || !name_ar) {
//         return res.status(400).json({ 
//           error: 'Name and Arabic name are required',
//           message: 'يجب إدخال اسم التصنيف باللغتين الإنجليزية والعربية'
//         });
//       }

//       // Handle uploaded file
//       let image_url = null;
//       if (req.file) {
//         image_url = `/uploads/categories/${req.file.filename}`;
//       }

//       const result = await pool.query(
//         `INSERT INTO categories (name, name_ar, icon, color, image_url) 
//          VALUES ($1, $2, $3, $4, $5) 
//          RETURNING *`,
//         [name, name_ar, icon || null, color || null, image_url]
//       );

//       // Clear categories cache
//       await deleteFromCache('categories:all');

//       res.status(201).json({ 
//         message: 'Category created successfully',
//         message_ar: 'تم إنشاء التصنيف بنجاح',
//         category: result.rows[0] 
//       });
//     } catch (err) {
//       console.error('Error creating category:', err);
//       if (err.code === '23505') {
//         res.status(400).json({ 
//           error: 'Category already exists',
//           message: 'التصنيف موجود مسبقاً'
//         });
//       } else {
//         res.status(500).json({ error: 'Server error' });
//       }
//     }
//   },

//   // Get single category
//   async getCategory(req, res) {
//     const { id } = req.params;
    
//     try {
//       const result = await pool.query(
//         `SELECT c.*, 
//                 COUNT(p.id) as product_count
//          FROM categories c
//          LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
//          WHERE c.id = $1
//          GROUP BY c.id`,
//         [id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       res.json(result.rows[0]);
//     } catch (err) {
//       console.error('Error fetching category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Update category (Admin only) - UPDATED FOR FILE UPLOAD
//   async updateCategory(req, res) {
//     const { id } = req.params;
//     const { name, name_ar, icon, color } = req.body;
    
//     try {
//       let query;
//       let queryParams;

//       if (req.file) {
//         // إذا كان هناك ملف جديد
//         query = `
//           UPDATE categories 
//           SET name = COALESCE($1, name),
//               name_ar = COALESCE($2, name_ar),
//               icon = COALESCE($3, icon),
//               color = COALESCE($4, color),
//               image_url = $5
//           WHERE id = $6
//           RETURNING *
//         `;
//         queryParams = [
//           name || null, 
//           name_ar || null, 
//           icon || null, 
//           color || null,
//           `/uploads/categories/${req.file.filename}`,
//           id
//         ];
//       } else {
//         // إذا لم يكن هناك ملف جديد
//         query = `
//           UPDATE categories 
//           SET name = COALESCE($1, name),
//               name_ar = COALESCE($2, name_ar),
//               icon = COALESCE($3, icon),
//               color = COALESCE($4, color)
//           WHERE id = $5
//           RETURNING *
//         `;
//         queryParams = [
//           name || null, 
//           name_ar || null, 
//           icon || null, 
//           color || null,
//           id
//         ];
//       }

//       const result = await pool.query(query, queryParams);
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       // Clear cache
//       await deleteFromCache('categories:all');
      
//       res.json({ 
//         message: 'Category updated successfully',
//         message_ar: 'تم تحديث التصنيف بنجاح',
//         category: result.rows[0] 
//       });
//     } catch (err) {
//       console.error('Error updating category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Delete category (Admin only)
//   async deleteCategory(req, res) {
//     const { id } = req.params;
    
//     try {
//       // Check if category has products
//       const productsCheck = await pool.query(
//         'SELECT COUNT(*) FROM products WHERE category_id = $1',
//         [id]
//       );
      
//       if (parseInt(productsCheck.rows[0].count) > 0) {
//         return res.status(400).json({ 
//           error: 'Cannot delete category with products',
//           message: 'لا يمكن حذف التصنيف لأنه يحتوي على منتجات'
//         });
//       }
      
//       const result = await pool.query(
//         'DELETE FROM categories WHERE id = $1 RETURNING *',
//         [id]
//       );
      
//       if (result.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       // Clear cache
//       await deleteFromCache('categories:all');
      
//       res.json({ 
//         message: 'Category deleted successfully',
//         message_ar: 'تم حذف التصنيف بنجاح'
//       });
//     } catch (err) {
//       console.error('Error deleting category:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   },

//   // Get category products
//   async getCategoryProducts(req, res) {
//     const { id } = req.params;
//     const { page = 1, limit = 20, sortBy } = req.query;
//     const offset = (page - 1) * limit;
    
//     try {
//       // Verify category exists
//       const categoryCheck = await pool.query(
//         'SELECT id, name, name_ar FROM categories WHERE id = $1',
//         [id]
//       );
      
//       if (categoryCheck.rows.length === 0) {
//         return res.status(404).json({ error: 'Category not found' });
//       }
      
//       let query = `
//         SELECT p.* 
//         FROM products p 
//         WHERE p.category_id = $1 AND p.in_stock = true
//       `;
//       const params = [id];
      
//       // Sorting
//       switch (sortBy) {
//         case 'price_asc':
//           query += ' ORDER BY p.price ASC';
//           break;
//         case 'price_desc':
//           query += ' ORDER BY p.price DESC';
//           break;
//         case 'rating':
//           query += ' ORDER BY p.rating DESC';
//           break;
//         case 'newest':
//           query += ' ORDER BY p.created_at DESC';
//           break;
//         default:
//           query += ' ORDER BY p.id';
//       }
      
//       query += ` LIMIT $2 OFFSET $3`;
//       params.push(limit, offset);
      
//       const result = await pool.query(query, params);
      
//       // Get total count
//       const countResult = await pool.query(
//         'SELECT COUNT(*) FROM products WHERE category_id = $1 AND in_stock = true',
//         [id]
//       );
//       const totalCount = parseInt(countResult.rows[0].count);
      
//       res.json({
//         category: categoryCheck.rows[0],
//         products: result.rows,
//         pagination: {
//           total: totalCount,
//           page: parseInt(page),
//           limit: parseInt(limit),
//           totalPages: Math.ceil(totalCount / limit)
//         }
//       });
//     } catch (err) {
//       console.error('Error fetching category products:', err);
//       res.status(500).json({ error: 'Server error' });
//     }
//   }
// };

// module.exports = categoryController;




const { pool } = require('../config/database');
const { redisClient } = require('../config/redis');

// Helper functions for cache
async function deleteFromCache(key) {
  if (!redisClient) return;
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Redis delete error:', err);
  }
}

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

// دالة للتحقق من صحة URL
function isValidImageUrl(url) {
  if (!url) return false;
  
  try {
    const parsedUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    
    // التحقق من البروتوكول
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return false;
    }
    
    // التحقق من امتداد الملف (اختياري)
    const pathname = parsedUrl.pathname.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => pathname.endsWith(ext));
    
    return hasValidExtension;
  } catch (err) {
    return false;
  }
}

const categoryController = {
  // Get all categories
  async getCategories(req, res) {
    try {
      const cacheKey = 'categories:all';
      
      // Check cache first
      const cached = await getFromCache(cacheKey);
      if (cached) {
        return res.json(cached);
      }
      
      const result = await pool.query(`
        SELECT c.*, 
               COUNT(p.id) as product_count
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
        GROUP BY c.id
        ORDER BY c.id
      `);
      
      const categories = result.rows;
      
      // Store in cache
      await setToCache(cacheKey, categories, 3600);
      
      res.json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Create new category (Admin only) - UPDATED FOR URL IMAGE
  async createCategory(req, res) {
    try {
      const { name, name_ar, icon, color, image_url } = req.body;

      if (!name || !name_ar) {
        return res.status(400).json({ 
          error: 'Name and Arabic name are required',
          message: 'يجب إدخال اسم التصنيف باللغتين الإنجليزية والعربية'
        });
      }

      // التحقق من صحة رابط الصورة إذا تم تقديمه
      if (image_url && !isValidImageUrl(image_url)) {
        return res.status(400).json({ 
          error: 'Invalid image URL',
          message: 'رابط الصورة غير صالح'
        });
      }

      const result = await pool.query(
        `INSERT INTO categories (name, name_ar, icon, color, image_url) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [name, name_ar, icon || null, color || null, image_url || null]
      );

      // Clear categories cache
      await deleteFromCache('categories:all');

      res.status(201).json({ 
        message: 'Category created successfully',
        message_ar: 'تم إنشاء التصنيف بنجاح',
        category: result.rows[0] 
      });
    } catch (err) {
      console.error('Error creating category:', err);
      if (err.code === '23505') {
        res.status(400).json({ 
          error: 'Category already exists',
          message: 'التصنيف موجود مسبقاً'
        });
      } else {
        res.status(500).json({ error: 'Server error' });
      }
    }
  },

  // Get single category
  async getCategory(req, res) {
    const { id } = req.params;
    
    try {
      const result = await pool.query(
        `SELECT c.*, 
                COUNT(p.id) as product_count
         FROM categories c
         LEFT JOIN products p ON c.id = p.category_id AND p.in_stock = true
         WHERE c.id = $1
         GROUP BY c.id`,
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error fetching category:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Update category (Admin only) - UPDATED FOR URL IMAGE
  async updateCategory(req, res) {
    const { id } = req.params;
    const { name, name_ar, icon, color, image_url } = req.body;
    
    try {
      // التحقق من صحة رابط الصورة إذا تم تقديمه
      if (image_url && !isValidImageUrl(image_url)) {
        return res.status(400).json({ 
          error: 'Invalid image URL',
          message: 'رابط الصورة غير صالح'
        });
      }

      const query = `
        UPDATE categories 
        SET name = COALESCE($1, name),
            name_ar = COALESCE($2, name_ar),
            icon = COALESCE($3, icon),
            color = COALESCE($4, color),
            image_url = COALESCE($5, image_url)
        WHERE id = $6
        RETURNING *
      `;
      
      const queryParams = [
        name || null, 
        name_ar || null, 
        icon || null, 
        color || null,
        image_url || null,
        id
      ];

      const result = await pool.query(query, queryParams);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Clear cache
      await deleteFromCache('categories:all');
      
      res.json({ 
        message: 'Category updated successfully',
        message_ar: 'تم تحديث التصنيف بنجاح',
        category: result.rows[0] 
      });
    } catch (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Delete category (Admin only)
  async deleteCategory(req, res) {
    const { id } = req.params;
    
    try {
      // Check if category has products
      const productsCheck = await pool.query(
        'SELECT COUNT(*) FROM products WHERE category_id = $1',
        [id]
      );
      
      if (parseInt(productsCheck.rows[0].count) > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete category with products',
          message: 'لا يمكن حذف التصنيف لأنه يحتوي على منتجات'
        });
      }
      
      const result = await pool.query(
        'DELETE FROM categories WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      // Clear cache
      await deleteFromCache('categories:all');
      
      res.json({ 
        message: 'Category deleted successfully',
        message_ar: 'تم حذف التصنيف بنجاح'
      });
    } catch (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Get category products
  async getCategoryProducts(req, res) {
    const { id } = req.params;
    const { page = 1, limit = 20, sortBy } = req.query;
    const offset = (page - 1) * limit;
    
    try {
      // Verify category exists
      const categoryCheck = await pool.query(
        'SELECT id, name, name_ar FROM categories WHERE id = $1',
        [id]
      );
      
      if (categoryCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
      }
      
      let query = `
        SELECT p.* 
        FROM products p 
        WHERE p.category_id = $1 AND p.in_stock = true
      `;
      const params = [id];
      
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
        default:
          query += ' ORDER BY p.id';
      }
      
      query += ` LIMIT $2 OFFSET $3`;
      params.push(limit, offset);
      
      const result = await pool.query(query, params);
      
      // Get total count
      const countResult = await pool.query(
        'SELECT COUNT(*) FROM products WHERE category_id = $1 AND in_stock = true',
        [id]
      );
      const totalCount = parseInt(countResult.rows[0].count);
      
      res.json({
        category: categoryCheck.rows[0],
        products: result.rows,
        pagination: {
          total: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / limit)
        }
      });
    } catch (err) {
      console.error('Error fetching category products:', err);
      res.status(500).json({ error: 'Server error' });
    }
  }
};

module.exports = categoryController;