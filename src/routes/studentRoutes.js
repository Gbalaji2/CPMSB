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

router.get("/me/profile", getMyStudentProfile);
router.put("/me/profile", updateMyStudentProfile);

router.post("/me/resume", uploadResume, uploadMyResume);

router.get("/me/dashboard", getStudentDashboard);

export default router;