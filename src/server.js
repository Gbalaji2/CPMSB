// ----------------- GLOBAL ERROR LISTENERS -----------------
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.stack);
  process.exit(1); // optional: exit on uncaught exceptions
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason.stack || reason);
});

// ----------------- ENV CONFIG -----------------
import dotenv from "dotenv";
dotenv.config();

// ----------------- MODULES -----------------
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { startInterviewReminderCron } from "./cron/interviewReminder.js";
import { setupSwagger } from "./utils/swagger.js";
import User from "./models/userModel.js";
import cors from "cors";

// ----------------- DATABASE -----------------
connectDB();

// ----------------- CORS (HTTP) -----------------
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

// ----------------- CREATE DEFAULT ADMIN -----------------
async function createDefaultAdmin() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@test.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const admin = new User({
      name: "College Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      isActive: true,
    });

    await admin.save();
    console.log("✅ Default admin created!");
  } catch (err) {
    console.error("Error creating default admin:", err.message);
  }
}

createDefaultAdmin();

// ----------------- SERVER -----------------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// ----------------- SOCKET.IO -----------------
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

initSocket(io);

// ----------------- SOCKET CONNECTION -----------------
io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("_id name role");
    if (!user) return socket.disconnect();

    socket.join(`user_${user._id}`);
    socket.join(`role_${user.role}`);

    console.log(`🟢 Socket connected: ${user.name} (${user.role})`);
  } catch (err) {
    console.log("Socket connection failed:", err.message);
    socket.disconnect();
  }
});

// ----------------- SWAGGER -----------------
setupSwagger(app);

// ----------------- CRON JOBS -----------------
startInterviewReminderCron();

// ----------------- PRINT ROUTES (DEV) -----------------
function printRoutes(app) {
  console.log("\nAvailable API Routes:\n");

  if (!app._router) {
    console.log("No routes registered yet.\n");
    return;
  }

  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods)
        .map((m) => m.toUpperCase())
        .join(", ");
      console.log(`${methods}  ${middleware.route.path}`);
    } else if (middleware.name === "router" && middleware.handle?.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (!handler.route) return;
        const methods = Object.keys(handler.route.methods)
          .map((m) => m.toUpperCase())
          .join(", ");
        console.log(`${methods}  ${handler.route.path}`);
      });
    }
  });

  console.log("\n-------------------------\n");
}

// ----------------- START SERVER -----------------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  printRoutes(app);
});