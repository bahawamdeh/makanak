const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createListing,
  getActiveListings,
  updateListing,
} = require("../controllers/listingController");

// إنشاء إعلان مع التحقق من صحة البيانات
router.post(
  "/",
  protect,
  authorize("landlord"),
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("location").not().isEmpty().withMessage("Location is required"),
    body("rooms").isInt({ min: 1 }).withMessage("Rooms must be a positive integer"),
  ],
  createListing
);

// عرض السكنات المفعّلة
router.get("/", protect, getActiveListings);

// تعديل إعلان مع التحقق من صحة البيانات
router.patch(
  "/:id",
  protect,
  authorize("landlord"),
  [
    body("title").optional().not().isEmpty().withMessage("Title is required"),
    body("location").optional().not().isEmpty().withMessage("Location is required"),
    body("rooms").optional().isInt({ min: 1 }).withMessage("Rooms must be a positive integer"),
  ],
  updateListing
);

module.exports = router;