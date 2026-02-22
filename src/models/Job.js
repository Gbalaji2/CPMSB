import mongoose from "mongoose";

const eligibilitySchema = new mongoose.Schema(
  {
    minCGPA: { type: Number, default: 0, min: 0, max: 10 },
    allowedDepartments: [{ type: String, trim: true }],
    year: { type: Number, min: 1, max: 5 },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    title: { type: String, required: true, trim: true, index: true },

    description: { type: String, required: true },

    location: { type: String, default: "Remote" },

    ctc: { type: Number, default: 0 },

    jobType: {
      type: String,
      enum: ["internship", "fulltime", "internship+ppo"],
      default: "fulltime",
      index: true,
    },

    eligibility: { type: eligibilitySchema, default: () => ({}) },

    skillsRequired: [{ type: String, trim: true }],

    lastDateToApply: { type: Date, required: true },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      index: true,
    },

    // optional: attach to a drive
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive",
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

/* Useful index for filtering + sorting */
jobSchema.index({ title: "text", description: "text" });

const Job = mongoose.model("Job", jobSchema);
export default Job;