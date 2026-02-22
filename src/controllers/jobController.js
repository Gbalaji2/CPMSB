import asyncHandler from "../utils/asyncHandler.js";
import Job from "../models/Job.js";
import Company from "../models/Company.js";
import { buildQuery } from "../utils/apiQuery.js";

/* COMPANY: create job */
export const createJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });

  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const {
    title,
    description,
    location,
    ctc,
    jobType,
    eligibility,
    skillsRequired,
    lastDateToApply,
    driveId,
  } = req.body;

  if (!title || !description || !lastDateToApply) {
    res.status(400);
    throw new Error("title, description, lastDateToApply are required");
  }

  const job = await Job.create({
    companyId: company._id,
    title,
    description,
    location,
    ctc,
    jobType,
    eligibility,
    skillsRequired,
    lastDateToApply,
    driveId: driveId || null,
  });

  res.status(201).json({ success: true, message: "Job created", job });
});

/* PUBLIC/STUDENT: list jobs */
export const listJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip, search, sortBy, order } = buildQuery(req.query);

  const filter = { status: "open" };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (req.query.jobType) filter.jobType = req.query.jobType;
  if (req.query.companyId) filter.companyId = req.query.companyId;

  const total = await Job.countDocuments(filter);

  const jobs = await Job.find(filter)
    .populate("companyId", "name logoUrl location")
    .sort({ [sortBy]: order })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    page,
    total,
    jobs,
  });
});

/* Get job details */
export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "companyId",
    "name logoUrl location website industry"
  );

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  res.json({ success: true, job });
});

/* COMPANY: update job */
export const updateJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.companyId.toString() !== company._id.toString()) {
    res.status(403);
    throw new Error("Not allowed to update this job");
  }

  const fields = [
    "title",
    "description",
    "location",
    "ctc",
    "jobType",
    "eligibility",
    "skillsRequired",
    "lastDateToApply",
    "status",
    "driveId",
  ];

  fields.forEach((f) => {
    if (req.body[f] !== undefined) job[f] = req.body[f];
  });

  await job.save();

  res.json({ success: true, message: "Job updated", job });
});

/* COMPANY: close job */
export const closeJob = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ userId: req.user._id });
  if (!company) {
    res.status(404);
    throw new Error("Company profile not found");
  }

  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  if (job.companyId.toString() !== company._id.toString()) {
    res.status(403);
    throw new Error("Not allowed");
  }

  job.status = "closed";
  await job.save();

  res.json({ success: true, message: "Job closed", job });
});