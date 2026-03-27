const RoommateRequest = require("../models/RoommateRequest");
const Notification = require("../models/Notification");
const Listing = require("../models/Listing");

// Student creates request
exports.createRoommateRequest = async (req, res, next) => {
  try {
    const { listingId, message } = req.body;

    // التحقق من وجود الحقول
    if (!listingId || !message) {
      return res.status(400).json({
        message: "listingId and message are required",
      });
    }

    const listing = await Listing.findById(listingId);

    // التحقق من وجود الإعلان
    if (!listing) {
      return res.status(404).json({
        message: "Listing not found",
      });
    }

    // التحقق من أن الإعلان مفعّل
    if (listing.status !== "active") {
      return res.status(400).json({
        message: "Listing is not active",
      });
    }

    // إنشاء الطلب
    const request = await RoommateRequest.create({
      student: req.user.id,
      listing: listingId,
      message,
    });

    // إنشاء إشعار للمؤجر
    await Notification.create({
      toUser: listing.landlord,
      type: "ROOMMATE_REQUEST",
      text: "طالب جديد يبحث عن شريك سكن",
      relatedRequest: request._id,
    });

    res.status(201).json({
      message: "Roommate request created",
      request,
    });
  } catch (error) {
    next(error);
  }
};

// Landlord views requests for their listings
exports.getRequestsForMyListings = async (req, res, next) => {
  try {
    const myListingIds = await Listing.find({
      landlord: req.user.id,
    }).distinct("_id");

    const requests = await RoommateRequest.find({
      listing: { $in: myListingIds },
    })
      .populate("student", "name email")
      .populate("listing");

    res.json({
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// Accept request
exports.acceptRequest = async (req, res, next) => {
  try {
    const request = await RoommateRequest.findById(req.params.id).populate("listing");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // التحقق أن المؤجر الحالي هو صاحب الإعلان
    if (request.listing.landlord.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to accept this request",
      });
    }

    // التحقق إذا كان الطلب قد تمت معالجته مسبقًا
    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request has already been processed",
      });
    }

    request.status = "accepted";
    await request.save();

    // إرسال إشعار للطالب
    await Notification.create({
      toUser: request.student,
      type: "REQUEST_ACCEPTED",
      text: "تم قبول طلب الشراكة بالسكن",
      relatedRequest: request._id,
    });

    res.json({
      message: "Request accepted",
      request,
    });
  } catch (error) {
    next(error);
  }
};

// Reject request
exports.rejectRequest = async (req, res, next) => {
  try {
    const request = await RoommateRequest.findById(req.params.id).populate("listing");

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // التحقق أن المؤجر الحالي هو صاحب الإعلان
    if (request.listing.landlord.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized to reject this request",
      });
    }

    // التحقق إذا كان الطلب قد تمت معالجته مسبقًا
    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request has already been processed",
      });
    }

    request.status = "rejected";
    await request.save();

    // إرسال إشعار للطالب
    await Notification.create({
      toUser: request.student,
      type: "REQUEST_REJECTED",
      text: "تم رفض طلب الشراكة بالسكن",
      relatedRequest: request._id,
    });

    res.json({
      message: "Request rejected",
      request,
    });
  } catch (error) {
    next(error);
  }
};