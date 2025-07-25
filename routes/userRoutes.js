const express = require("express");
const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

const router = express.Router();

// AUTH ROUTES
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware

router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);

router.get(
  "/me",

  userController.getMe,
  userController.getUser
);

router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictTo("admin"));

// USER ROUTES
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
