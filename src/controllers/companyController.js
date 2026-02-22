import asyncHandler from "../utils/asyncHandler.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";

import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const getMyCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id }).populate(
    "userId",
    "name email role"
  );

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  res.json({ success: true, company });
});

export const updateMyCompanyProfile = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const { name, description, website, industry, location, contacts } = req.body;

  if (name !== undefined) company.name = name;
  if (description !== undefined) company.description = description;
  if (website !== undefined) company.website = website;
  if (industry !== undefined) company.industry = industry;
  if (location !== undefined) company.location = location;

  // contacts can be array
  if (contacts !== undefined) {
    company.contacts = Array.isArray(contacts) ? contacts : [];
  }

  await company.save();

  res.json({ success: true, message: "Company updated", company });
});

export const uploadCompanyLogo = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Logo file is required");
  }

  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const result = await uploadBufferToCloudinary(
    req.file.buffer,
    "placements/company-logos",
    "image"
  );

  company.logoUrl = result.secure_url;
  await company.save();

  res.json({
    success: true,
    message: "Logo uploaded",
    logoUrl: company.logoUrl,
  });
});

export const getCompanyDashboard = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const companyId = company._id;

  const jobsPosted = await Job.countDocuments({ companyId });

  const totalApplicants = await Application.countDocuments({ companyId });

  const shortlisted = await Application.countDocuments({
    companyId,
    status: "shortlisted",
  });

  const interviews = await Interview.find({ companyId })
    .sort({ slot: 1 })
    .limit(5)
    .populate("jobId", "title")
    .populate("studentId", "name email");

  res.json({
    success: true,
    stats: {
      jobsPosted,
      totalApplicants,
      shortlisted,
      upcomingInterviews: interviews,
    },
  });
});