import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    slot: { type: Date, required: true, index: true },

    format: {
      type: String,
      enum: ["virtual", "in_person"],
      default: "virtual",
      index: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "no_show"],
      default: "scheduled",
      index: true,
    },

    reminderSent: { type: Boolean, default: false },

    // Agora
    agoraChannel: { type: String, default: "" },
    meetingLink: { type: String, default: "" },

    remarks: { type: String, default: "" },
  },
  { timestamps: true }
);

/* Avoid duplicate interview for same application */
interviewSchema.index({ applicationId: 1 }, { unique: true });

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;