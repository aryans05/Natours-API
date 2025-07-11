const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./utils/globalErrorHandler");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1. MIDDLEWARES
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// 3. UNHANDLED ROUTES
app.use(globalErrorHandler);

module.exports = app;
