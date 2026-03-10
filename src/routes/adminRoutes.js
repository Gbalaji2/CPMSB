import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  getAdminOverview,
  listStudents,
  listCompanies,
  listJobsAdmin,
  listDrivesAdmin,
  verifyCompany,
  toggleBlockUser,
  deleteJobByAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Middlewares
router.use(protect);
router.use(allowRoles("admin", "tpo"));

/* Dashboard */
router.get("/overview", getAdminOverview);

/* Students */
router.get("/students", listStudents);

/* Companies */
router.get("/companies", listCompanies);
router.patch("/companies/:companyId/verify", verifyCompany);

/* Jobs */
router.get("/jobs", listJobsAdmin);
router.delete("/jobs/:jobId", deleteJobByAdmin);

/* Drives */
router.get("/drives", listDrivesAdmin);

/* Users */
router.patch("/users/:userId/block", toggleBlockUser);

export default router;