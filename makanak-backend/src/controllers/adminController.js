const mongoose = require("mongoose");
const User = require("../models/User");
const Listing = require("../models/Listing");

// إحصائيات عامة للـ Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    const listingsCount = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: "active" });
    const pendingListings = await Listing.countDocuments({
      status: "pending_payment",
    });
    const suspendedListings = await Listing.countDocuments({
      status: "suspended",
    });

    res.json({
      users: usersCount,
      listings: listingsCount,
      activeListings,
      pendingListings,
      suspendedListings,
    });
  } catch (error) {
    next(error);
  }
};

// جلب كل المستخدمين
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// حذف مستخدم
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete an admin user" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// جلب كل الإعلانات
exports.getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().populate("landlord", "name email");

    res.json({
      count: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

// تعليق إعلان
exports.suspendListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.status = "suspended";
    await listing.save();

    res.json({
      message: "Listing suspended successfully",
      listing,
    });
  } catch (error) {
    next(error);
  }
};

// تفعيل إعلان
exports.activateListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid listing ID" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    listing.status = "active";
    await listing.save();

    res.json({
      message: "Listing activated successfully",
      listing,
    });
  } catch (error) {
    next(error);
  }
};//////////////