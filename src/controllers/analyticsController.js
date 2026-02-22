import asyncHandler from "../utils/asyncHandler.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";
import Company from "../models/Company.js";

/* ADMIN: analytics dashboard */
export const getAnalytics = asyncHandler(async (req, res) => {
  const jobsPerCompany = await Job.aggregate([
    {
      $group: {
        _id: "$companyId",
        totalJobs: { $sum: 1 },
      },
    },
    { $sort: { totalJobs: -1 } },
  ]);

  const appsPerJob = await Application.aggregate([
    {
      $group: {
        _id: "$jobId",
        totalApplications: { $sum: 1 },
      },
    },
    { $sort: { totalApplications: -1 } },
  ]);

  const statusSummary = await Application.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const topStudents = await StudentProfile.find()
    .sort({ cgpa: -1 })
    .limit(10)
    .populate("userId", "name email");

  const companies = await Company.find().select("name");

  res.json({
    success: true,
    analytics: {
      jobsPerCompany,
      appsPerJob,
      statusSummary,
      topStudents,
      companies,
    },
  });
});