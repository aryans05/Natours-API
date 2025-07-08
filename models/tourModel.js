const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have name"],
      unique: true,
      maxlength: [40, "A tour must have less or equalthan 40 characters"],
      minlength: [10, "A tour must have less or equalthan 10 characters"],
      //    validate: [validator.isAlpha, "Tour Name Must Only Contain Characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have duration"],
    },

    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },

    ratingQuantity: {
      type: Number,
      default: 0,
    },

    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have required group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty"],
      enum: ["easy", "medium", "difficult"],
      message: "Difficulty is either: easy, medium , difficult",
    },
    price: {
      type: Number,
      required: [true, "A tour must have price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // This only point to current document so it will not update
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: [true, "A tour must have description"],
    },
    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have the cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },

    startDates: [Date],

    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationsWeeks").get(function () {
  return this.duration / 7;
});

// Document Middleware : runs before .save() and .create() .insertMany()

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre("save", function (next) {
//   console.log("will save document ");
//   next();
// });

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query Middleware

tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start}milliseconds!`);
});

// Aggregation Middleware

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
