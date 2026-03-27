const Listing = require("../models/Listing");
const Payment = require("../models/Payment");

// دفع إعلان
exports.payForListing = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      const error = new Error("Listing not found");
      error.statusCode = 404;
      throw error;
    }

    if (listing.status !== "pending_payment") {
      const error = new Error("Listing is not awaiting payment");
      error.statusCode = 400;
      throw error;
    }

    if (listing.landlord.toString() !== req.user.id) {
      const error = new Error("Not authorized to pay for this listing");
      error.statusCode = 403;
      throw error;
    }

    const payment = await Payment.create({
      user: req.user.id,
      listing: listing._id,
      amount: 10,
      method: "mock",
      status: "paid",
    });

    listing.status = "active";
    listing.paidAt = new Date();
    await listing.save();

    res.json({
      message: "Payment successful. Listing is now active",
      listing,
      payment,
    });
  } catch (error) {
    next(error);
  }
};