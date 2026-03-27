const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

// حماية التوكن والتفويض للأدوار
router.get("/dashboard", protect, authorize("admin"), getDashboardStats);
router.get("/users", protect, authorize("admin"), getAllUsers);

// حذف مستخدم مع التحقق من وجود المستخدم
router.delete("/users/:id", protect, authorize("admin"), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // إذا كان المستخدم نفسه هو المستخدم الذي يحاول حذفه
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin user" });
    }

    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;