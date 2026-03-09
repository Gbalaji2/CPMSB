import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";

import {
  getMyStudentProfile,
  updateMyStudentProfile,
  uploadMyResume,
  getStudentDashboard,
} from "../controllers/studentController.js";

const router = express.Router();

/* Student only */
router.use(protect, allowRoles("student"));

router.get("/student/my/profile", getMyStudentProfile);
router.put("/student/my/profile", updateMyStudentProfile);

router.post("/student/my/resume", uploadResume, uploadMyResume);

router.get("/student/my/dashboard", getStudentDashboard);

export default router;