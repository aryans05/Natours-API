const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Models
const Tour = require("../../models/tourModel");
const User = require("../../models/userModel");
const Review = require("../../models/reviewModel");

// Load environment variables
dotenv.config({ path: "./config.env" });

// DB Connection
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ DB connection successful!"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ✅ Read and prepare JSON data
let tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
tours = tours.map((tour) => {
  // Ensure `secretTour` field is explicitly defined
  if (tour.secretTour === undefined) tour.secretTour = false;
  return tour;
});

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// ✅ Import Data
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log("✅ Data successfully loaded!");
  } catch (err) {
    console.error("❌ Import Error:", err);
  }
  process.exit();
};

// ✅ Delete All Data
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log("🗑️  Data successfully deleted!");
  } catch (err) {
    console.error("❌ Deletion Error:", err);
  }
  process.exit();
};

// ✅ Run command
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("❓ Unknown command. Use --import or --delete");
  process.exit();
}
