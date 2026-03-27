const mongoose = require("mongoose");

const roommateRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // التحقق من أن الطالب موجود في قاعدة البيانات
      validate: {
        validator: async function (value) {
          const student = await mongoose.model("User").findById(value);
          return student !== null;
        },
        message: "Student must be a valid user",
      },
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      // التحقق من أن الإعلان موجود في قاعدة البيانات
      validate: {
        validator: async function (value) {
          const listing = await mongoose.model("Listing").findById(value);
          return listing !== null && listing.status === "active"; // التأكد من أن الإعلان مفعّل
        },
        message: "Listing must be active and valid",
      },
    },
    message: {
      type: String,
      required: true,
      minlength: 10,  // الحد الأدنى لطول الرسالة
      maxlength: 500, // الحد الأقصى لطول الرسالة
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RoommateRequest", roommateRequestSchema);