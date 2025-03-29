import express from "express"
import User from "../models/User.js"
import { authenticate } from "../middleware/auth.js"

const router = express.Router()

// Get dashboard stats
router.get("/", authenticate, async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments()

    // Get active users (users who logged in within the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
      isActive: true,
    })

    // Get inactive users
    const inactiveUsers = await User.countDocuments({
      $or: [{ lastLogin: { $lt: thirtyDaysAgo } }, { lastLogin: { $exists: false } }, { isActive: false }],
    })

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

