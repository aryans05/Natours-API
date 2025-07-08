const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");
dotenv.config({ path: "./config.env" });

// Connect to DB
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error("DB connection error:", err));

// Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8")
);

// Import data to DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit(); // exit process
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // Fixed method name
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit(); // exit process
};

// Command-line argument check
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
