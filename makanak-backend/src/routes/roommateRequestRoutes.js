const express = require("express");
const router = express.Router();

const {
  createRoommateRequest,
  getRequestsForMyListings,
  acceptRequest,
  rejectRequest,
} = require("../controllers/roommateRequestController");

const { protect, authorize } = require("../middleware/authMiddleware");

// إنشاء طلب شريك سكن (للطالب)
router.post("/", protect, authorize("student"), createRoommateRequest);

// عرض طلبات السكن للمؤجر
router.get(
  "/my-listings",
  protect,
  authorize("landlord"),
  getRequestsForMyListings
);

// قبول طلب الشريك
router.patch(
  "/:id/accept",
  protect,
  authorize("landlord"),
  acceptRequest
);

// رفض طلب الشريك
router.patch(
  "/:id/reject",
  protect,
  authorize("landlord"),
  rejectRequest
);

module.exports = router;