const { pool } = require("../config/database")

const adminUsersController = {
  // Get all users with pagination and filters
  async getUsers(req, res) {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      membership_level = "",
      is_verified = "",
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query

    const offset = (page - 1) * limit

    try {
      let query = `
        SELECT 
          id, name, phone, email, role, membership_level, points, total_orders,
          is_verified, address_street, address_city, address_district, address_postal_code,
          created_at, updated_at
        FROM users 
        WHERE 1=1
      `

      let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`
      const params = []
      const countParams = []
      let paramCount = 0

      // Search filter
      if (search) {
        paramCount++
        query += ` AND (name ILIKE $${paramCount} OR phone ILIKE $${paramCount} OR email ILIKE $${paramCount})`
        countQuery += ` AND (name ILIKE $${paramCount} OR phone ILIKE $${paramCount} OR email ILIKE $${paramCount})`
        params.push(`%${search}%`)
        countParams.push(`%${search}%`)
      }

      // Role filter
      if (role) {
        paramCount++
        query += ` AND role = $${paramCount}`
        countQuery += ` AND role = $${paramCount}`
        params.push(role)
        countParams.push(role)
      }

      // Membership level filter
      if (membership_level) {
        paramCount++
        query += ` AND membership_level = $${paramCount}`
        countQuery += ` AND membership_level = $${paramCount}`
        params.push(membership_level)
        countParams.push(membership_level)
      }

      // Verification status filter
      if (is_verified !== "") {
        paramCount++
        query += ` AND is_verified = $${paramCount}`
        countQuery += ` AND is_verified = $${paramCount}`
        params.push(is_verified === "true")
        countParams.push(is_verified === "true")
      }

      // Validate sort columns to prevent SQL injection
      const validSortColumns = [
        "name",
        "phone",
        "email",
        "role",
        "membership_level",
        "points",
        "total_orders",
        "created_at",
        "updated_at",
      ]
      const validSortOrder = ["ASC", "DESC"]

      const safeSortBy = validSortColumns.includes(sortBy) ? sortBy : "created_at"
      const safeSortOrder = validSortOrder.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : "DESC"

      // Add sorting and pagination
      query += ` ORDER BY ${safeSortBy} ${safeSortOrder} LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
      params.push(Number.parseInt(limit), offset)

      // Execute queries
      const result = await pool.query(query, params)
      const countResult = await pool.query(countQuery, countParams)

      const totalCount = Number.parseInt(countResult.rows[0].count)
      const totalPages = Math.ceil(totalCount / limit)

      res.json({
        success: true,
        users: result.rows,
        pagination: {
          currentPage: Number.parseInt(page),
          totalPages: totalPages,
          totalUsers: totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          limit: Number.parseInt(limit),
        },
        filters: {
          search,
          role,
          membership_level,
          is_verified,
          sortBy: safeSortBy,
          sortOrder: safeSortOrder,
        },
      })
    } catch (err) {
      console.error("Error fetching users:", err)
      res.status(500).json({
        success: false,
        error: "Failed to fetch users",
        message_ar: "فشل في جلب المستخدمين",
      })
    }
  },

  // Get user by ID
  async getUserById(req, res) {
    const { userId } = req.params

    try {
      const result = await pool.query(
        `SELECT 
          id, name, phone, email, role, membership_level, points, total_orders,
          is_verified, address_street, address_city, address_district, address_postal_code,
          created_at, updated_at
         FROM users 
         WHERE id = $1`,
        [userId],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          message_ar: "المستخدم غير موجود",
        })
      }

      const user = result.rows[0]

      // Get user's orders count by status
      const ordersStats = await pool.query(
        `SELECT status, COUNT(*) as count 
         FROM orders 
         WHERE user_id = $1 
         GROUP BY status`,
        [userId],
      )

      res.json({
        success: true,
        user: user,
        ordersStats: ordersStats.rows,
      })
    } catch (err) {
      console.error("Error fetching user:", err)
      res.status(500).json({
        success: false,
        error: "Failed to fetch user",
        message_ar: "فشل في جلب بيانات المستخدم",
      })
    }
  },

  // Get users statistics
  async getUsersStats(req, res) {
    try {
      // Total users count
      const totalUsers = await pool.query("SELECT COUNT(*) FROM users")

      // Users by role
      const usersByRole = await pool.query(`
        SELECT role, COUNT(*) as count 
        FROM users 
        GROUP BY role
      `)

      // Users by membership level
      const usersByMembership = await pool.query(`
        SELECT membership_level, COUNT(*) as count 
        FROM users 
        WHERE membership_level IS NOT NULL 
        GROUP BY membership_level
      `)

      // Verified vs unverified users
      const verificationStats = await pool.query(`
        SELECT is_verified, COUNT(*) as count 
        FROM users 
        GROUP BY is_verified
      `)

      // New users this month
      const newUsersThisMonth = await pool.query(`
        SELECT COUNT(*) as count 
        FROM users 
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `)

      res.json({
        success: true,
        stats: {
          totalUsers: Number.parseInt(totalUsers.rows[0].count),
          newUsersThisMonth: Number.parseInt(newUsersThisMonth.rows[0].count),
          usersByRole: usersByRole.rows,
          usersByMembership: usersByMembership.rows,
          verificationStats: verificationStats.rows,
        },
      })
    } catch (err) {
      console.error("Error fetching users statistics:", err)
      res.status(500).json({
        success: false,
        error: "Failed to fetch users statistics",
        message_ar: "فشل في جلب إحصائيات المستخدمين",
      })
    }
  },

  async updateUser(req, res) {
    const { userId } = req.params
    const { name, email, role, membership_level, points, total_orders, address } = req.body

    try {
      // Check if user exists
      const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [userId])
      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          message_ar: "المستخدم غير موجود",
        })
      }

      // Validate role if provided
      if (role) {
        const validRoles = ["customer", "admin", "manager"]
        if (!validRoles.includes(role)) {
          return res.status(400).json({
            success: false,
            error: "Invalid role",
            message_ar: "الدور غير صالح",
          })
        }
      }

      // Validate membership level if provided
      if (membership_level) {
        const validLevels = ["bronze", "silver", "gold", "platinum"]
        if (!validLevels.includes(membership_level)) {
          return res.status(400).json({
            success: false,
            error: "Invalid membership level",
            message_ar: "مستوى العضوية غير صالح",
          })
        }
      }

      // Build dynamic update query
      const updateFields = []
      const updateValues = []
      let paramCount = 0

      if (name !== undefined) {
        paramCount++
        updateFields.push(`name = $${paramCount}`)
        updateValues.push(name)
      }

      if (email !== undefined) {
        paramCount++
        updateFields.push(`email = $${paramCount}`)
        updateValues.push(email)
      }

      if (role !== undefined) {
        paramCount++
        updateFields.push(`role = $${paramCount}`)
        updateValues.push(role)
      }

      if (membership_level !== undefined) {
        paramCount++
        updateFields.push(`membership_level = $${paramCount}`)
        updateValues.push(membership_level)
      }

      if (points !== undefined) {
        paramCount++
        updateFields.push(`points = $${paramCount}`)
        updateValues.push(Number.parseInt(points))
      }

      if (total_orders !== undefined) {
        paramCount++
        updateFields.push(`total_orders = $${paramCount}`)
        updateValues.push(Number.parseInt(total_orders))
      }

      if (address) {
        if (address.street !== undefined) {
          paramCount++
          updateFields.push(`address_street = $${paramCount}`)
          updateValues.push(address.street)
        }
        if (address.city !== undefined) {
          paramCount++
          updateFields.push(`address_city = $${paramCount}`)
          updateValues.push(address.city)
        }
        if (address.district !== undefined) {
          paramCount++
          updateFields.push(`address_district = $${paramCount}`)
          updateValues.push(address.district)
        }
        if (address.postalCode !== undefined) {
          paramCount++
          updateFields.push(`address_postal_code = $${paramCount}`)
          updateValues.push(address.postalCode)
        }
      }

      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No fields to update",
          message_ar: "لا توجد حقول للتحديث",
        })
      }

      updateFields.push("updated_at = CURRENT_TIMESTAMP")
      paramCount++
      updateValues.push(userId)

      const updateQuery = `
        UPDATE users 
        SET ${updateFields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *
      `

      const result = await pool.query(updateQuery, updateValues)
      const updatedUser = result.rows[0]

      console.log(`✏️ Admin updated user: ${updatedUser.name || updatedUser.phone}`)

      res.json({
        success: true,
        message: "User updated successfully",
        message_ar: "تم تحديث المستخدم بنجاح",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          phone: updatedUser.phone,
          email: updatedUser.email,
          role: updatedUser.role,
          membership_level: updatedUser.membership_level,
          points: updatedUser.points,
          total_orders: updatedUser.total_orders,
          address: {
            street: updatedUser.address_street,
            city: updatedUser.address_city,
            district: updatedUser.address_district,
            postalCode: updatedUser.address_postal_code,
          },
        },
      })
    } catch (err) {
      console.error("Error updating user:", err)
      res.status(500).json({
        success: false,
        error: "Failed to update user",
        message_ar: "فشل في تحديث المستخدم",
      })
    }
  },

  async deleteUser(req, res) {
    const { userId } = req.params

    try {
      // Check if user exists
      const userCheck = await pool.query("SELECT id, role FROM users WHERE id = $1", [userId])
      if (userCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "User not found",
          message_ar: "المستخدم غير موجود",
        })
      }

      const user = userCheck.rows[0]

      // Prevent deleting admin users (optional safety measure)
      if (user.role === "admin") {
        return res.status(400).json({
          success: false,
          error: "Cannot delete admin users",
          message_ar: "لا يمكن حذف مستخدمين المشرفين",
        })
      }

      // Use transaction to delete user and related data
      const client = await pool.connect()

      try {
        await client.query("BEGIN")

        // Delete user's cart items
        await client.query("DELETE FROM cart WHERE user_id = $1", [userId])

        // Delete user's notifications
        await client.query("DELETE FROM notifications WHERE user_id = $1", [userId])

        // Delete user's orders and order items
        const userOrders = await client.query("SELECT id FROM orders WHERE user_id = $1", [userId])

        for (const order of userOrders.rows) {
          await client.query("DELETE FROM order_items WHERE order_id = $1", [order.id])
        }

        await client.query("DELETE FROM orders WHERE user_id = $1", [userId])

        // Finally delete the user
        await client.query("DELETE FROM users WHERE id = $1", [userId])

        await client.query("COMMIT")

        console.log(`🗑️ Admin deleted user: ${user.name || user.phone}`)

        res.json({
          success: true,
          message: "User deleted successfully",
          message_ar: "تم حذف المستخدم بنجاح",
        })
      } catch (err) {
        await client.query("ROLLBACK")
        throw err
      } finally {
        client.release()
      }
    } catch (err) {
      console.error("Error deleting user:", err)
      res.status(500).json({
        success: false,
        error: "Failed to delete user",
        message_ar: "فشل في حذف المستخدم",
      })
    }
  },
}

module.exports = adminUsersController
