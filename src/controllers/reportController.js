import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";
import StudentProfile from "../models/StudentProfile.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

/* Report: students list */
export const studentsReport = asyncHandler(async (req, res) => {
  const students = await StudentProfile.find()
    .populate("userId", "name email")
    .sort({ cgpa: -1 });

  res.json({ success: true, report: students });
});

/* Report: applications per job */
export const jobApplicationsReport = asyncHandler(async (req, res) => {
  const jobId = req.params.jobId;

  const job = await Job.findById(jobId).populate("companyId", "name");
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const apps = await Application.find({ jobId })
    .populate("studentId", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    job: {
      id: job._id,
      title: job.title,
      company: job.companyId.name,
    },
    applications: apps,
  });
});

/* Report: placed students */
export const placedStudentsReport = asyncHandler(async (req, res) => {
  const apps = await Application.find({ status: "selected" })
    .populate("studentId", "name email")
    .populate("jobId", "title ctc")
    .sort({ updatedAt: -1 });

  res.json({ success: true, placed: apps });
});