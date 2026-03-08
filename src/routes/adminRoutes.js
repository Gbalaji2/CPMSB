import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  getAdminOverview,
  listStudents,
  listCompanies,
  verifyCompany,
  toggleBlockUser,
  deleteJobByAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Apply middlewares to all routes in this router
router.use(protect);                // User must be logged in
router.use(allowRoles("admin", "tpo")); // User must have admin or TPO role

// Admin-only routes
router.get("/overview", getAdminOverview);
router.get("/students", listStudents);
router.get("/companies", listCompanies);

router.patch("/companies/:companyId/verify", verifyCompany);
router.patch("/users/:userId/block", toggleBlockUser);

router.delete("/jobs/:jobId", deleteJobByAdmin);

export default router;