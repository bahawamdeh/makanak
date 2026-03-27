const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      // التحقق من أن المستخدم مرتبط بإشعار صحيح
      validate: {
        validator: async function (value) {
          const user = await mongoose.model("User").findById(value);
          return user !== null;
        },
        message: "toUser must be a valid user",
      },
    },
    type: {
      type: String,
      required: true,
      enum: ["ROOMMATE_REQUEST", "REQUEST_ACCEPTED", "REQUEST_REJECTED"], // تحديد أنواع الإشعارات المسموح بها
    },
    text: {
      type: String,
      required: true,
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoommateRequest",
      default: null, // يمكن أن يكون `null` إذا لم يكن هناك طلب مرتبط
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);