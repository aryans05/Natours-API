const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

// Top 5 cheap tours
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

// Tour statistics
router.route("/tour-stats").get(tourController.getTourStats);

// Monthly plan — must be defined before `/:id`
router
  .route("/monthly-plan/:year") // ✅ fixed: added `year` parameter
  .get(tourController.getMonthlyPlan);

// Get all tours, Create a new tour
router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

// Handle single tour by ID
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.UpdateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
