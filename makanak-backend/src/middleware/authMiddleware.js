const jwt = require("jsonwebtoken");

// حماية التوكن
exports.protect = (req, res, next) => {
  let token;

  // التحقق من وجود التوكن في الهيدر
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // استخراج التوكن من الهيدر
  }

  // في حالة عدم وجود التوكن
  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided" });
  }

  try {
    // التحقق من صلاحية التوكن باستخدام JWT_SECRET من المتغيرات البيئية
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // إضافة بيانات المستخدم في الـ request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next(); // المتابعة إلى المسار التالي
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired", error: error.message });
  }
};

// ✅ Authorization (التحقق من الأدوار)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // التحقق من إذا كان الدور الذي يملك المستخدم يسمح له بالوصول
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }
    next(); // المتابعة إلى المسار التالي
  };
};