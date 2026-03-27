const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// تسجيل مستخدم جديد
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // التحقق من أن جميع الحقول موجودة
    if (!name || !email || !password || !role) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const error = new Error("Invalid email format");
      error.statusCode = 400;
      throw error;
    }

    // التحقق من أن كلمة المرور قوية
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      const error = new Error("Password must be at least 8 characters long, include uppercase, lowercase, and a number");
      error.statusCode = 400;
      throw error;
    }

    // التحقق إذا كان المستخدم موجودًا بالفعل
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      name: user.name,  // إرسال اسم المستخدم مع الرد
    });
  } catch (error) {
    next(error);
  }
};

// تسجيل دخول المستخدم
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // التحقق من وجود البريد الإلكتروني وكلمة المرور
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      throw error;
    }

    // البحث عن المستخدم باستخدام البريد الإلكتروني
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // مقارنة كلمة المرور المدخلة مع كلمة المرور المخزنة
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // توليد رمز JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,  // تأكد من وجود هذا المتغير في .env
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id,  // إرسال معرف المستخدم مع الرد
      name: user.name,    // إرسال اسم المستخدم أيضًا
    });
  } catch (error) {
    next(error);
  }
};