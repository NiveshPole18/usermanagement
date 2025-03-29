import express from "express"
import User from "../models/User.js"
import { authenticate, authorize } from "../middleware/auth.js"

const router = express.Router()

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get all users with pagination
router.get("/", authenticate, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const search = req.query.search || ""

    let query = {}
    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      }
    }

    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Get user by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Create a new user (admin only)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: role || "user",
      isActive: isActive !== undefined ? isActive : true,
    })

    await user.save()

    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update user
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body

    // Check if user exists
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check permissions
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized to update this user" })
    }

    // Update fields
    if (name) user.name = name
    if (email) user.email = email

    // Only admin can update role and status
    if (req.user.role === "admin") {
      if (role) user.role = role
      if (isActive !== undefined) user.isActive = isActive
    }

    await user.save()

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Update user password
router.put("/password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Get user
    const user = await User.findById(req.user._id)

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

// Delete user
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Check if user exists
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check permissions
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Not authorized to delete this user" })
    }

    await User.findByIdAndDelete(req.params.id)

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
})

export default router

