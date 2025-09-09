import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import morgan from "morgan";

const app = express();

app.use(errorHandler);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 30,
  delayAfter: 1,
  delayMs: 5 * 60 * 1000,
});
app.use(limiter);

//routes
app.use("/api/auth", limiter, authRouter);
app.use("/", (req, res) => {
  console.log("server is running");
});

//middleware for undefined route
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

export default app;
