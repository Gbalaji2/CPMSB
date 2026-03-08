// server.js
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./config/socket.js";
import { startInterviewReminderCron } from "./cron/interviewReminder.js";
import { setupSwagger } from "./utils/swagger.js";

import jwt from "jsonwebtoken";
import User from "./models/User.js";
import bcrypt from "bcryptjs";

connectDB();

// --- Create default admin if not exists ---
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (adminExists) return console.log("Admin already exists");

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new User({
      name: "College Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Default admin created!");
  } catch (err) {
    console.error("Error creating default admin:", err.message);
  }
}

createDefaultAdmin(); // Run on startup

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

/* Socket.io */
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

initSocket(io);

/* Rooms: user_<id> and role_<role> */
io.on("connection", async (socket) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return socket.disconnect();

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).select("_id name role");

    if (!user) return socket.disconnect();

    socket.join(`user_${user._id}`);
    socket.join(`role_${user.role}`);

    console.log(`Socket connected: ${user.name} (${user.role})`);
  } catch (err) {
    socket.disconnect();
  }
});

/* Swagger Setup */
setupSwagger(app);

/* Cron Jobs */
startInterviewReminderCron();

server.listen(PORT, () => console.log(`Server running on ${PORT}`));