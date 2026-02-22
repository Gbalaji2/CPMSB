import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  studentsReport,
  jobApplicationsReport,
  placedStudentsReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.get("/students", protect, allowRoles("admin", "tpo"), studentsReport);

router.get(
  "/jobs/:jobId/applications",
  protect,
  allowRoles("admin", "tpo"),
  jobApplicationsReport
);

router.get(
  "/placed",
  protect,
  allowRoles("admin", "tpo"),
  placedStudentsReport
);

export default router;