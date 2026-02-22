import { getIO } from "../config/socket.js";

export const notifyUser = (userId, payload) => {
  const io = getIO();
  io.to(`user_${userId}`).emit("notification", payload);
};

export const notifyRole = (role, payload) => {
  const io = getIO();
  io.to(`role_${role}`).emit("notification", payload);
};