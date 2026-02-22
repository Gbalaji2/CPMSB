import asyncHandler from "../utils/asyncHandler.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import StudentProfile from "../models/StudentProfile.js";
import { sendEmail } from "../utils/sendEmail.js";
import { notifyUser } from "../utils/notify.js";

/* STUDENT: apply for job */
export const applyJob = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const jobId = req.params.jobId;

  const profile = await StudentProfile.findOne({ userId: studentId });
  if (!profile) {
    res.status(404);
    throw new Error("Student profile not found");
  }

  if (!profile.resumeUrl) {
    res.status(400);
    throw new Error("Upload resume before applying");
  }

  const job = await Job.findById(jobId).populate("companyId", "name userId");
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.status !== "open") {
    res.status(400);
    throw new Error("Job is closed");
  }

  const today = new Date();
  if (job.lastDateToApply < today) {
    res.status(400);
    throw new Error("Last date to apply is over");
  }

  // Eligibility check
  if (job.eligibility?.minCGPA && profile.cgpa < job.eligibility.minCGPA) {
    res.status(400);
    throw new Error("You do not meet CGPA eligibility");
  }

  // Create application
  const app = await Application.create({
    studentId,
    jobId: job._id,
    companyId: job.companyId._id,
    status: "submitted",
  });

  // Notify company user
  notifyUser(job.companyId.userId, {
    type: "NEW_APPLICATION",
    message: `${req.user.name} applied for ${job.title}`,
    jobId: job._id,
    applicationId: app._id,
  });

  res.status(201).json({
    success: true,
    message: "Applied successfully",
    application: app,
  });
});

/* STUDENT: list my applications */
export const getMyApplications = asyncHandler(async (req, res) => {
  const apps = await Application.find({ studentId: req.user._id })
    .sort({ createdAt: -1 })
    .populate({
      path: "jobId",
      select: "title location ctc jobType status",
      populate: { path: "companyId", select: "name logoUrl location" },
    });

  res.json({ success: true, applications: apps });
});

/* COMPANY: list applicants for job */
export const getApplicantsForJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.companyId.toString() !== company._id.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  const applicants = await Application.find({
    jobId: job._id,
    companyId: company._id,
  })
    .sort({ createdAt: -1 })
    .populate("studentId", "name email")
    .populate({
      path: "studentId",
      select: "name email",
    });

  res.json({ success: true, applicants });
});

/* COMPANY: update application status */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const { status } = req.body;

  const allowed = ["shortlisted", "rejected", "selected", "offer_sent"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid status update");
  }

  const app = await Application.findById(req.params.applicationId)
    .populate("studentId", "name email")
    .populate("jobId", "title");

  if (!app) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (app.companyId.toString() !== company._id.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  app.status = status;
  await app.save();

  // Notify student
  notifyUser(app.studentId._id, {
    type: "APPLICATION_STATUS",
    message: `Your application for ${app.jobId.title} is now ${status}`,
    applicationId: app._id,
  });

  // Email student (optional)
  await sendEmail({
    to: app.studentId.email,
    subject: `Application Update: ${app.jobId.title}`,
    html: `
      <h3>Hello ${app.studentId.name},</h3>
      <p>Your application status for <b>${app.jobId.title}</b> is now:</p>
      <h2>${status.toUpperCase()}</h2>
      <p>Regards,<br/>Placement Cell</p>
    `,
  });

  res.json({ success: true, message: "Status updated", application: app });
});