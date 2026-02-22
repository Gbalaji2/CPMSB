import cron from "node-cron";
import Interview from "../models/Interview.js";
import User from "../models/User.js";
import { io } from "../server.js"; // We’ll export io from server.js
import mongoose from "mongoose";

/* Cron Job: runs every minute */
export const startInterviewReminderCron = () => {
  console.log("Starting Interview Reminder Cron...");

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const in15Minutes = new Date(now.getTime() + 15 * 60 * 1000);

      // Find interviews scheduled in next 15 mins and reminder not sent
      const interviews = await Interview.find({
        slot: { $gte: now, $lte: in15Minutes },
        reminderSent: false,
      })
        .populate("studentId", "name email")
        .populate("companyId", "name");

      for (const interview of interviews) {
        const student = interview.studentId;
        const company = interview.companyId;

        // Send notification via Socket.io
        if (io) {
          io.to(`user_${student._id}`).emit("interviewReminder", {
            message: `Reminder: Your interview with ${company.name} is at ${interview.slot.toLocaleTimeString()}`,
            interviewId: interview._id,
          });
        }

        // Mark reminder as sent
        interview.reminderSent = true;
        await interview.save();

        console.log(
          `Reminder sent for interview ${interview._id} to student ${student.name}`
        );
      }
    } catch (err) {
      console.error("Error in Interview Reminder Cron:", err);
    }
  });
};