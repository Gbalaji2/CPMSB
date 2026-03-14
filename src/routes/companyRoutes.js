import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import multer from "multer";

import {
  getMyCompanyProfile,
  updateMyCompanyProfile,
  uploadCompanyLogo,
  getCompanyDashboard,
  updateApplicationStatus,
  getApplicantsForJob
} from "../controllers/companyController.js";

const router = express.Router();

/* simple image upload */
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, allowRoles("company"));

/* Company Profile */
router.get("/my/profile", getMyCompanyProfile);
router.put("/my/profile", updateMyCompanyProfile);

/* Upload Logo */
router.post("/my/logo", upload.single("logo"), uploadCompanyLogo);

/* Dashboard */
router.get("/my/dashboard", getCompanyDashboard);

/* Update Student Application Status */
router.patch("/applications/:applicationId/status", updateApplicationStatus);

/* Get Applicants for a Job */
router.get("/jobs/:jobId/applicants", getApplicantsForJob);

export default router;