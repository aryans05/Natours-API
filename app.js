const express = require("express");
const morgan = require("morgan");
const AppError = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const globalErrorHandler = require("./utils/globalErrorHandler");
const reviewRouter = require("./routes/reviewRoutes");

const hpp = require("hpp");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const ExpressMongoSanitize = require("express-mongo-sanitize");

const app = express();

// 1. MIDDLEWARES

app.use(helmet());
app.use(express.json());
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP, Please try again in an hour!",
});

app.use("/api", limiter);

// Data sanitization against no sql query injection
const mongoSanitize = (req, res, next) => {
  const sanitize = (obj) => {
    for (const key in obj) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
};

app.use(mongoSanitize);

// Data sanitization against xss

// Prevent Paremeter Pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// 3. UNHANDLED ROUTES

// 4. GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

module.exports = app;
