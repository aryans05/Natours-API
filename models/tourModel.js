const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./userModel"); // Ensure the path is correct

// Define schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxlength: [40, "A tour name must have less or equal than 40 characters"],
      minlength: [10, "A tour name must have more or equal than 10 characters"],
      // validate: [validator.isAlpha, 'Name must only contain letters'] // optional
    },

    slug: String,

    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
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
      required: [true, "A tour must have a group size"],
    },

    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, or difficult",
      },
    },

    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
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

    // Embed multiple guides by reference
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number], // [longitude, latitude]
        address: String,
        description: String,
        day: Number,
      },
    ],

    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
// Virtual Populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

//tourSchema .index ({})
tourSchema.index({ startLocation: "2dsphere" });

// DOCUMENT MIDDLEWARE: before saving a document
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// // Convert guide IDs to actual user documents (embedding pattern)
// tourSchema.pre("save", async function (next) {
//   if (!this.guides || this.guides.length === 0) return next();

//   // Sanitize and validate guide IDs
//   this.guides = this.guides
//     .map((id) => id.toString().trim())
//     .filter((id) => mongoose.Types.ObjectId.isValid(id));

//   const guideDocs = await Promise.all(
//     this.guides.map((id) => User.findById(id))
//   );
//   this.guides = guideDocs.filter(Boolean); // remove nulls if any ID was invalid

//   next();
// });

// QUERY MIDDLEWARE: remove secret tours from any find query
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// // AGGREGATION MIDDLEWARE: remove secret tours from aggregation
// tourSchema.pre("aggregate", function (next) {
//   if (!this.pipeline()[0]?.$match?.secretTour) {
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   }
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
