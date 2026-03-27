require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// التأكد من أن المتغيرات البيئية المطلوبة موجودة
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("Missing required environment variables (MONGO_URI, JWT_SECRET)");
  process.exit(1);  // إيقاف التطبيق إذا كانت المتغيرات البيئية مفقودة
}

connectDB(); // الاتصال بقاعدة البيانات

const PORT = process.env.PORT || 5000; // تحديد المنفذ
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// test push