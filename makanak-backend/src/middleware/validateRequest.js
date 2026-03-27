const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  // إذا كانت هناك أخطاء في التحقق من البيانات
  if (!errors.isEmpty()) {
    // إرسال رسالة خطأ تحتوي على تفاصيل الأخطاء
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.param, // اسم الحقل الذي حدث فيه الخطأ
        message: err.msg,  // الرسالة المرفقة بالخطأ
      })),
    });
  }

  next(); 
};