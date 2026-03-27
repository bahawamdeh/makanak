module.exports = (err, req, res, next) => {
  // تسجيل الأخطاء في وحدة التحكم مع الوقت
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  const statusCode = err.statusCode || 500;

  // في بيئة التطوير، أرسل معلومات أكثر تفصيلًا
  if (process.env.NODE_ENV === 'development') {
    res.status(statusCode).json({
      message: err.message || "Server Error",
      stack: err.stack, // إرسال stack trace في بيئة التطوير
    });
  } else {
    // في بيئة الإنتاج، أرسل رسالة خطأ بسيطة
    res.status(statusCode).json({
      message: err.message || "Server Error",
    });
  }
};