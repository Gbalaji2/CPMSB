import asyncHandler from "../utils/asyncHandler.js";
import Drive from "../models/Drive.js";

/* PUBLIC */
export const listDrives = asyncHandler(async (req, res) => {
  const drives = await Drive.find()
    .sort({ date: -1 })
    .populate("companies.companyId", "name logoUrl location");

  res.json({ success: true, drives });
});

export const getDriveById = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id)
    .populate("companies.companyId", "name logoUrl location")
    .populate("companies.jobs", "title ctc jobType status");

  if (!drive) {
    res.status(404);
    throw new Error("Drive not found");
  }

  res.json({ success: true, drive });
});

/* ADMIN/TPO */
export const createDrive = asyncHandler(async (req, res) => {
  const { name, date, description } = req.body;

  if (!name || !date) {
    res.status(400);
    throw new Error("name and date are required");
  }

  const drive = await Drive.create({
    name,
    date: new Date(date),
    description: description || "",
  });

  res.status(201).json({ success: true, message: "Drive created", drive });
});

export const updateDrive = asyncHandler(async (req, res) => {
  const drive = await Drive.findById(req.params.id);

  if (!drive) {
    res.status(404);
    throw new Error("Drive not found");
  }

  const fields = ["name", "date", "description", "companies", "stats"];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) drive[f] = req.body[f];
  });

  await drive.save();

  res.json({ success: true, message: "Drive updated", drive });
});