const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

// Top 5 cheap tours
router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

// Tour statistics
router.route("/tour-stats").get(tourController.getTourStats);

// Monthly plan — must be defined before `/:id`
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

// Get all tours, Create a new tour
router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// This must come last — handles routes like `/tours/:id`
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.UpdateTour)
  .delete(tourController.deleteTour);

module.exports = router;
