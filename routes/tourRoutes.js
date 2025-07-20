const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./../routes/reviewRoutes");

const router = express.Router();

// ✅ Nested routes: Forward requests to /:tourId/reviews to reviewRouter
router.use("/:tourId/reviews", reviewRouter);

// ✅ Route for top 5 cheap tours
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

// ✅ Route for tour statistics
router.route("/tour-stats").get(tourController.getTourStats);

// ✅ Route for monthly plan (protected & role-restricted)
router
  .route("/monthly-plan/:year")
  .get(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

// ✅ Route for geospatial query: tours within a distance
// Example: /tours-within/233/center/30.687345644629364,76.66452903912155/unit/mi
router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distance/:latlng/unit/:unit").get(tourController.getDistances);

// ✅ Main routes for tours
router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

// ✅ Single tour routes (by ID)
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
