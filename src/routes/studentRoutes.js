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

router.get("/profile", getMyStudentProfile);
router.put("/profile", updateMyStudentProfile);

router.post("/resume", uploadResume, uploadMyResume);

router.get("/dashboard", getStudentDashboard);

export default router;