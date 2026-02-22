import e from "express";
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "shortlisted",
        "rejected",
        "interview_scheduled",
        "selected",
        "offer_sent",
        "offer_accepted",
      ],
      default: "submitted",
      index: true,
    },

    appliedAt: { type: Date, default: Date.now },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

/* Prevent duplicate applications */
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);
export default Application;