import express from "express";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

/* Example route for CSV import */
router.post("/students", asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "CSV import endpoint (adminImportRoutes) placeholder",
  });
}));

export default router;