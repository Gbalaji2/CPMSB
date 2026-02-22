import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  scheduleInterview,
  getMyInterviews,
  getCompanyInterviews,
  getInterviewToken,
} from "../controllers/interviewController.js";

const router = express.Router();

/* COMPANY schedules */
router.post(
  "/schedule",
  protect,
  allowRoles("company"),
  scheduleInterview
);

/* STUDENT view */
router.get("/me", protect, allowRoles("student"), getMyInterviews);

/* COMPANY view */
router.get(
  "/company",
  protect,
  allowRoles("company"),
  getCompanyInterviews
);

/* Token for interview (student/company/admin/tpo) */
router.get(
  "/:id/token",
  protect,
  allowRoles("student", "company", "admin", "tpo"),
  getInterviewToken
);

export default router;