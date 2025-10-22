const express = require("express")
const router = express.Router()
const adminUsersController = require("../controllers/adminController")
const { authenticateJWT, isAdmin } = require("../middleware/auth")

// All routes require admin authentication
router.use(authenticateJWT, isAdmin)

// Get users statistics
router.get("/admin/users/stats", adminUsersController.getUsersStats)

// Get all users with filters and pagination
router.get("/admin/users", adminUsersController.getUsers)

// Get specific user by ID
router.get("/admin/users/:userId", adminUsersController.getUserById)

// Update user information
router.put("/admin/users/:userId", adminUsersController.updateUser)

// Delete user
router.delete("/admin/users/:userId", adminUsersController.deleteUser)

module.exports = router
