import asyncHandler from "../utils/asyncHandler.js";
import StudentProfile from "../models/StudentProfile.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const getMyStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id })
    .populate("placedCompanyId", "name logoUrl location")
    .populate("userId", "name email role");

  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  res.json({ success: true, profile });
});

export const updateMyStudentProfile = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ userId: req.user._id });

  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const {
    rollNo,
    department,
    year,
    cgpa,
    phone,
    skills,
    linkedin,
    github,
    portfolio,
  } = req.body;

  if (rollNo !== undefined) profile.rollNo = rollNo;
  if (department !== undefined) profile.department = department;
  if (year !== undefined) profile.year = year;
  if (cgpa !== undefined) profile.cgpa = cgpa;
  if (phone !== undefined) profile.phone = phone;

  // skills can be string or array
  if (skills !== undefined) {
    if (Array.isArray(skills)) profile.skills = skills;
    else profile.skills = skills.split(",").map((s) => s.trim());
  }

  if (linkedin !== undefined) profile.linkedin = linkedin;
  if (github !== undefined) profile.github = github;
  if (portfolio !== undefined) profile.portfolio = portfolio;

  await profile.save();

  res.json({ success: true, message: "Profile updated", profile });
});

export const uploadMyResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Resume file is required");
  }

  const profile = await StudentProfile.findOne({ userId: req.user._id });
  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  const result = await uploadBufferToCloudinary(
    req.file.buffer,
    "placements/resumes",
    "raw"
  );

  profile.resumeUrl = result.secure_url;
  await profile.save();

  res.json({
    success: true,
    message: "Resume uploaded",
    resumeUrl: profile.resumeUrl,
  });
});

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const totalApplications = await Application.countDocuments({ studentId });

  const shortlisted = await Application.countDocuments({
    studentId,
    status: "shortlisted",
  });

  const rejected = await Application.countDocuments({
    studentId,
    status: "rejected",
  });

  const interviews = await Interview.find({ studentId })
    .sort({ slot: 1 })
    .limit(5)
    .populate("companyId", "name logoUrl")
    .populate("jobId", "title");

  res.json({
    success: true,
    stats: {
      totalApplications,
      shortlisted,
      rejected,
      upcomingInterviews: interviews,
    },
  });
});