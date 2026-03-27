const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // إعدادات الاتصال بـ MongoDB
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // لتجنب التحذيرات من Mongoose
      useFindAndModify: false,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // إخراج خطأ والمغادرة مع رمز 1 للإشارة إلى أن العملية فشلت
    process.exit(1);
  }
};

module.exports = connectDB;