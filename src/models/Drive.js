import mongoose from "mongoose";

const driveSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },

    date: { type: Date, required: true, index: true },

    description: { type: String, default: "" },

    companies: [
      {
        companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
        jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
      },
    ],

    stats: {
      participants: { type: Number, default: 0 },
      offers: { type: Number, default: 0 },
      placed: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Drive = mongoose.model("Drive", driveSchema);
export default Drive;