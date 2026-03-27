const express = require("express");
const router = express.Router();
const { payForListing } = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/listings/:listingId/pay",
  protect, // التحقق من صلاحية التوكن
  authorize("landlord"), // التحقق من أن المستخدم هو "landlord"
  async (req, res, next) => {
    try {
      const { listingId } = req.params;

      // التحقق من وجود الإعلان في قاعدة البيانات قبل الدفع
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      // إذا كان الإعلان ليس في حالة "انتظار الدفع"، لا يمكن دفعه
      if (listing.status !== "pending_payment") {
        return res.status(400).json({ message: "This listing is not awaiting payment" });
      }

      // استدعاء دالة الدفع
      await payForListing(req, res);

      res.json({
        message: "Payment successful, listing is now active",
      });
    } catch (error) {
      next(error); // تمرير الخطأ إلى ميدلوير التعامل مع الأخطاء
    }
  }
);

module.exports = router;