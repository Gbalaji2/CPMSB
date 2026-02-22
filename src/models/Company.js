import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, default: "" },
    website: { type: String, default: "" },
    industry: { type: String, default: "" },
    location: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    contacts: [
      {
        name: { type: String, trim: true },
        email: { type: String, trim: true },
        phone: { type: String, trim: true },
        designation: { type: String, trim: true },
      },
    ],
    isVerified: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;