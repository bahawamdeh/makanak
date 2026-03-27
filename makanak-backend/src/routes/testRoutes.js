const { protect, authorize } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

// مسار للطلاب فقط
router.get(
  "/student",
  protect,
  authorize("student"),
  (req, res) => {
    res.json({
      message: `Welcome Student 👋, ${req.user.name}`,
      user: req.user,
    });
  }
);

// مسار للمؤجرين فقط
router.get(
  "/landlord",
  protect,
  authorize("landlord"),
  (req, res) => {
    res.json({
      message: `Welcome Landlord 👋, ${req.user.name}`,
    });
  }
);

module.exports = router;