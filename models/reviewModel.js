const mongoose = require("mongoose");
const Tour = require("./tourModel"); // Make sure the path is correct

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty!"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Review must belong to a tour."],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must belong to a user."],
  },
});

// =======================================
// STATIC METHOD: To calculate stats
// =======================================

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // Step 1: Aggregate review stats for the given tour
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, // Only reviews for this tour
    },
    {
      $group: {
        _id: "$tour", // Group by tour ID
        nRating: { $sum: 1 }, // Count number of ratings
        avgRating: { $avg: "$rating" }, // Average rating
      },
    },
  ]);

  // Step 2: Update the Tour document
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingAverage: stats[0].avgRating,
    });
  } else {
    // If no reviews, reset to defaults
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: 0,
      ratingAverage: 4.5,
    });
  }
};

// =======================================
// POST-SAVE HOOK: After a new review is saved
// =======================================

reviewSchema.post("save", function () {
  // this.constructor points to the model
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
