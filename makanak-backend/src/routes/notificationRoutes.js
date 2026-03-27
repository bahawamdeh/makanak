const express = require("express");
const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// جلب إشعارات المستخدم الحالي
router.get("/", protect, async (req, res, next) => {
  try {
    const notifications = await getMyNotifications(req, res);
    if (!notifications.length) {
      return res.status(200).json({
        message: "No notifications found for this user",
      });
    }
    res.json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
});

// تعليم الإشعار كمقروء
router.patch("/:id/read", protect, async (req, res, next) => {
  try {
    const notification = await markAsRead(req, res);
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }
    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;