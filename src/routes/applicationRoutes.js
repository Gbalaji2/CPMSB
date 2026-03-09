import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  applyJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

/* STUDENT */
router.post(
  "/apply/:jobId",
  protect,
  allowRoles("student"),
  applyJob
);

router.get("/my", protect, allowRoles("student"), getMyApplications);

/* COMPANY */
router.get(
  "/job/:jobId/applicants",
  protect,
  allowRoles("company"),
  getApplicantsForJob
);

router.patch(
  "/:applicationId/status",
  protect,
  allowRoles("company"),
  updateApplicationStatus
);

export default router;