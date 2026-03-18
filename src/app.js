import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import driveRoutes from "./routes/driveRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminAnalyticsRoutes from "./routes/adminAnalyticsRoutes.js";
import adminImportRoutes from "./routes/adminImportRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();
app.set("trust proxy", 1);

/* Security + Logs */
app.use(helmet());
app.use(morgan("dev"));

/* Rate Limit */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests, please try later.",
  })
);

/* Body */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://cpmsf.netlify.app"
    ],
    credentials: true,
  })
);

/* Routes */
app.get("/", (req, res) => res.send("Placement Backend Running"));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/drives", driveRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/admin/analytics", adminAnalyticsRoutes);
app.use("/api/admin/import", adminImportRoutes);

app.use("/api/reports", reportRoutes);

/* Errors */
app.use(notFound);
app.use(errorHandler);

export default app;