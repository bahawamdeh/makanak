const Listing = require("../models/Listing");

// إنشاء إعلان سكن
exports.createListing = async (req, res, next) => {
  try {
    const { title, location, rooms } = req.body;

    // التحقق من أن جميع الحقول موجودة
    if (!title || !location || !rooms) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    // إنشاء الإعلان
    const listing = await Listing.create({
      title,
      location,
      rooms,
      landlord: req.user.id, // ربط الإعلان بالمستخدم
      status: "pending_payment", // الحالة الأولية للإعلان
    });

    res.status(201).json({
      message: "Listing created (pending payment)",
      listing,
    });
  } catch (error) {
    next(error);
  }
};

// عرض الإعلانات المفعّلة فقط
exports.getActiveListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ status: "active" }).populate(
      "landlord", // إظهار تفاصيل المؤجر
      "name email"
    );

    res.json({
      count: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

// تعديل إعلان
exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      const error = new Error("Listing not found");
      error.statusCode = 404;
      throw error;
    }

    // التحقق من أن المستخدم هو صاحب الإعلان
    if (listing.landlord.toString() !== req.user.id) {
      const error = new Error("Not authorized to update this listing");
      error.statusCode = 403;
      throw error;
    }

    // التحقق من حالة الإعلان (لا يمكن تعديله إذا كان مكتملًا أو مقفلًا)
    if (listing.status === "completed" || listing.status === "closed") {
      const error = new Error("Cannot update a completed or closed listing");
      error.statusCode = 400;
      throw error;
    }

    // تحديث الحقول بناءً على المدخلات
    const { title, location, rooms } = req.body;

    if (title) listing.title = title;
    if (location) listing.location = location;
    if (rooms) listing.rooms = rooms;

    await listing.save();

    res.json({
      message: "Listing updated",
      listing,
    });
  } catch (error) {
    next(error);
  }
};