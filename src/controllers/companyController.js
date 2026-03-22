import asyncHandler from "../utils/asyncHandler.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";

import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

/* ======================================
   COMPANY: Get Company Profile
====================================== */
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

/* ======================================
   COMPANY: Update Company Profile
====================================== */
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

  if (contacts !== undefined) {
    company.contacts = Array.isArray(contacts) ? contacts : [];
  }

  await company.save();

  res.json({
    success: true,
    message: "Company updated",
    company,
  });
});

/* ======================================
   COMPANY: Upload Company Logo
====================================== */
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

/* ======================================
   COMPANY: Dashboard
====================================== */
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

/* ======================================
   COMPANY: Update Application Status
====================================== */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const application = await Application.findById(req.params.applicationId);

  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Security check
  if (application.companyId.toString() !== company._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this application");
  }

  application.status = status;
  await application.save();

  res.json({
    success: true,
    message: "Application status updated",
    application,
  });
});

/* ======================================
   COMPANY: View Applicants for a Job
====================================== */
export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const jobId = req.params.jobId;

  const applications = await Application.find({
    jobId,
    companyId: company._id,
  })
    .populate("studentId", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: applications.length,
    applications,
  });
});

/* ======================================
   COMPANY: Get All Jobs Posted by Company
====================================== */
export const getCompanyJobs = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const jobs = await Job.find({ companyId: company._id }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    count: jobs.length,
    jobs,
  });
});