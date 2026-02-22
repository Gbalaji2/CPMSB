import asyncHandler from "../utils/asyncHandler.js";
import Interview from "../models/Interview.js";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import { notifyUser } from "../utils/notify.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateAgoraToken } from "../utils/agora.js";

/* COMPANY: schedule interview */
export const scheduleInterview = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const { applicationId, slot, format } = req.body;

  if (!applicationId || !slot) {
    res.status(400);
    throw new Error("applicationId and slot are required");
  }

  const app = await Application.findById(applicationId)
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

  const job = await Job.findById(app.jobId._id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  const channel = `interview_${app._id}`;

  const interview = await Interview.create({
    studentId: app.studentId._id,
    companyId: company._id,
    jobId: job._id,
    applicationId: app._id,
    slot: new Date(slot),
    format: format || "virtual",
    status: "scheduled",
    agoraChannel: channel,
    meetingLink: `${process.env.FRONTEND_URL || "http://localhost:5173"}/student/interviews/${app._id}`,
  });

  // Update application status
  app.status = "interview_scheduled";
  await app.save();

  // Notify student
  notifyUser(app.studentId._id, {
    type: "INTERVIEW_SCHEDULED",
    message: `Interview scheduled for ${app.jobId.title}`,
    interviewId: interview._id,
    slot: interview.slot,
  });

  // Email student
  await sendEmail({
    to: app.studentId.email,
    subject: `Interview Scheduled - ${app.jobId.title}`,
    html: `
      <h3>Hello ${app.studentId.name},</h3>
      <p>Your interview for <b>${app.jobId.title}</b> has been scheduled.</p>
      <p><b>Slot:</b> ${new Date(slot).toLocaleString()}</p>
      <p><b>Format:</b> ${interview.format}</p>
      <p><b>Join Link:</b> ${interview.meetingLink}</p>
      <br/>
      <p>Regards,<br/>Placement Cell</p>
    `,
  });

  res.status(201).json({
    success: true,
    message: "Interview scheduled",
    interview,
  });
});

/* STUDENT: list my interviews */
export const getMyInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({ studentId: req.user._id })
    .sort({ slot: 1 })
    .populate("companyId", "name logoUrl location")
    .populate("jobId", "title");

  res.json({ success: true, interviews });
});

/* COMPANY: list interviews */
export const getCompanyInterviews = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const interviews = await Interview.find({ companyId: company._id })
    .sort({ slot: 1 })
    .populate("jobId", "title")
    .populate("studentId", "name email");

  res.json({ success: true, interviews });
});

/* TOKEN endpoint */
export const getInterviewToken = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    res.status(404);
    throw new Error("Interview not found");
  }

  // Only student/company/admin can access
  const userRole = req.user.role;

  const isStudent = interview.studentId.toString() === req.user._id.toString();
  const isCompanyUser =
    userRole === "company" &&
    (await Company.findOne({ userId: req.user._id, _id: interview.companyId }));

  const isAdmin = userRole === "admin" || userRole === "tpo";

  if (!isStudent && !isCompanyUser && !isAdmin) {
    res.status(403);
    throw new Error("Not allowed");
  }

  const token = generateAgoraToken({
    channelName: interview.agoraChannel,
    uid: 0,
    role: "publisher",
    expireSeconds: 3600,
  });

  res.json({
    success: true,
    channel: interview.agoraChannel,
    token,
    appId: process.env.AGORA_APP_ID,
  });
});