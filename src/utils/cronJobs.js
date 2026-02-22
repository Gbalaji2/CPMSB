import cron from "node-cron";
import Interview from "../models/Interview.js";
import { sendEmail } from "./sendEmail.js";

/* Run every 10 minutes */
export const startCronJobs = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const now = new Date();
      const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

      const interviews = await Interview.find({
        status: "scheduled",
        slot: { $gte: now, $lte: nextHour },
        reminderSent: { $ne: true },
      }).populate("studentId", "name email");

      for (const i of interviews) {
        await sendEmail({
          to: i.studentId.email,
          subject: "Interview Reminder",
          html: `
            <h3>Hello ${i.studentId.name},</h3>
            <p>This is a reminder that your interview is scheduled within 1 hour.</p>
            <p><b>Slot:</b> ${new Date(i.slot).toLocaleString()}</p>
            <p><b>Join Link:</b> ${i.meetingLink}</p>
          `,
        });

        i.reminderSent = true;
        await i.save();
      }
    } catch (err) {
      console.log("Cron error:", err.message);
    }
  });
};