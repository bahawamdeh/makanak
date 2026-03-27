const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { register, login } = require("../controllers/authController");

// تحقق من البيانات قبل التسجيل
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 6 characters long"),
    body("name").not().isEmpty().withMessage("Name is required")
  ],
  register
);

// تحقق من البيانات قبل تسجيل الدخول
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
  ],
  login
);

module.exports = router;