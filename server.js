// // Top-level safety net for programmer errors (sync)
// process.on("uncaughtException", (err) => {
//   console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
//   console.error(err.name, err.message);
//   process.exit(1);
// });

const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config({ path: "./config.env" });

const app = require("./app");

// Connect to DB
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// // Handle unhandled promise rejections (async)
// process.on("unhandledRejection", (err) => {
//   console.error("UNHANDLED REJECTION! 💥 Shutting down...");
//   console.error(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
