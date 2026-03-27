const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3, // فرض حد أدنى لعدد الأحرف في العنوان
      maxlength: 100, // فرض حد أقصى لعدد الأحرف في العنوان
    },
    location: {
      type: String,
      required: true,
      trim: true,
      minlength: 3, // فرض حد أدنى لعدد الأحرف في الموقع
      maxlength: 200, // فرض حد أقصى لعدد الأحرف في الموقع
    },
    rooms: {
      type: Number,
      required: true,
      min: 1, // الحد الأدنى للغرف
      max: 10, // الحد الأقصى للغرف (مثال: الحد الأقصى يمكن تحديده إذا كان هذا مناسبًا)
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // التحقق من أن المؤجر هو مستخدم موجود في قاعدة البيانات
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return user !== null;
        },
        message: "Landlord must be a valid user",
      },
    },
    status: {
      type: String,
      enum: ["pending_payment", "active", "suspended"],
      default: "pending_payment",
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Listing", listingSchema);