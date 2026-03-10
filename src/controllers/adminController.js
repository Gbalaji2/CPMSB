import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";

import { importStudentsFromCSV } from "../utils/csvImport.js";
import multer from "multer";
import fs from "fs";

/* ===============================
   Multer Setup for CSV Upload
================================ */
const upload = multer({ dest: "uploads/" });
export const uploadMiddleware = upload.single("file");

/* ===============================
   ADMIN: System Overview
================================ */
export const getAdminOverview = asyncHandler(async (req, res) => {

  const totalUsers = await User.countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalCompanies = await User.countDocuments({ role: "company" });

  const totalJobs = await Job.countDocuments();
  const openJobs = await Job.countDocuments({ status: "open" });

  const totalApplications = await Application.countDocuments();
  const totalInterviews = await Interview.countDocuments();

  res.json({
    success: true,
    overview: {
      totalUsers,
      totalStudents,
      totalCompanies,
      totalJobs,
      openJobs,
      totalApplications,
      totalInterviews
    }
  });

});


/* ===============================
   ADMIN: List Students
================================ */
export const listStudents = asyncHandler(async (req, res) => {

  const students = await User.find({ role: "student" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: students.length,
    students
  });

});


/* ===============================
   ADMIN: List Companies
================================ */
export const listCompanies = asyncHandler(async (req, res) => {

  const companies = await Company.find()
    .populate("userId", "name email role isBlocked")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: companies.length,
    companies
  });

});


/* ===============================
   ADMIN: Verify Company
================================ */
export const verifyCompany = asyncHandler(async (req, res) => {

  const company = await Company.findById(req.params.companyId);

  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  company.isVerified = true;
  await company.save();

  res.json({
    success: true,
    message: "Company verified",
    company
  });

});


/* ===============================
   ADMIN: Block / Unblock User
================================ */
export const toggleBlockUser = asyncHandler(async (req, res) => {

  const user = await User.findById(req.params.userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({
    success: true,
    message: user.isBlocked ? "User blocked" : "User unblocked",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked
    }
  });

});


/* ===============================
   ADMIN: Delete Job
================================ */
export const deleteJobByAdmin = asyncHandler(async (req, res) => {

  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  await Application.deleteMany({ jobId: job._id });
  await Interview.deleteMany({ jobId: job._id });

  await job.deleteOne();

  res.json({
    success: true,
    message: "Job deleted successfully"
  });

});


/* ===============================
   ADMIN: Import Students via CSV
================================ */
export const importStudentsCSV = asyncHandler(async (req, res) => {

  if (!req.file) {
    res.status(400);
    throw new Error("CSV file required");
  }

  const result = await importStudentsFromCSV(req.file.path);

  fs.unlinkSync(req.file.path);

  res.json({
    success: true,
    message: "CSV import completed",
    result
  });

});


/* ===============================
   ADMIN: List All Jobs
================================ */
export const listJobsAdmin = asyncHandler(async (req, res) => {

  const jobs = await Job.find()
    .populate("companyId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: jobs.length,
    jobs
  });

});


/* ===============================
   ADMIN: List Placement Drives
================================ */
export const listDrivesAdmin = asyncHandler(async (req, res) => {

  const drives = await Job.find()
    .populate("companyId", "name")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: drives.length,
    drives
  });

});