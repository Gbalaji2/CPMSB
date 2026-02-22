import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    rollNo: { type: String, trim: true, unique: true, sparse: true },

    department: { type: String, trim: true },
    year: { type: Number, min: 1, max: 5 },

    cgpa: { type: Number, min: 0, max: 10, default: 0 },

    phone: { type: String, trim: true },

    skills: [{ type: String, trim: true }],

    resumeUrl: { type: String, default: "" },

    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" },

    placementStatus: {
      type: String,
      enum: ["not_placed", "placed"],
      default: "not_placed",
      index: true,
    },

    placedCompanyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },

    offers: [
      {
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
        ctc: { type: Number, default: 0 },
        accepted: { type: Boolean, default: false },
        offeredAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema); 
export default StudentProfile;