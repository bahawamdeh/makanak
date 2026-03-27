const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,  // الحد الأدنى لطول الاسم
      maxlength: 100, // الحد الأقصى لطول الاسم
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // التحقق من صحة البريد الإلكتروني باستخدام regex
    },
    password: {
      type: String,
      required: true,
      minlength: 6,  // الحد الأدنى لطول كلمة المرور
    },
    role: {
      type: String,
      enum: ["student", "landlord", "admin"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// تشفير كلمة المرور قبل حفظها في قاعدة البيانات
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // إذا لم يتم تعديل كلمة المرور، لا حاجة للتشفير
  }

  // تشفير كلمة المرور
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// إضافة وظيفة للتحقق من صحة كلمة المرور عند التسجيل أو تسجيل الدخول
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);