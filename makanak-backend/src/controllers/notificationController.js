const Notification = require("../models/Notification");

// جلب إشعارات المستخدم الحالي
exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      toUser: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// تعليم الإشعار كمقروء
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // أمان: المستخدم لا يعدّل إشعار غيره
    if (notification.toUser.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // إذا كان الإشعار مقروءًا مسبقًا
    if (notification.read) {
      return res.status(400).json({
        message: "Notification already marked as read",
      });
    }

    notification.read = true;
    await notification.save();

    res.json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// عدد الإشعارات غير المقروءة
exports.getUnreadCount = async (req, res, next) => {
  try {
    const unread = await Notification.countDocuments({
      toUser: req.user.id,
      read: false,
    });

    res.json({ unread });
  } catch (error) {
    next(error);
  }
};