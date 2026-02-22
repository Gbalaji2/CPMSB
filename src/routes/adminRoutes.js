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

router.get("/overview", protect, allowRoles("admin", "tpo"), getAdminOverview);

router.get("/students", protect, allowRoles("admin", "tpo"), listStudents);

router.get("/companies", protect, allowRoles("admin", "tpo"), listCompanies);

router.patch(
  "/companies/:companyId/verify",
  protect,
  allowRoles("admin", "tpo"),
  verifyCompany
);

router.patch(
  "/users/:userId/block",
  protect,
  allowRoles("admin", "tpo"),
  toggleBlockUser
);

router.delete(
  "/jobs/:jobId",
  protect,
  allowRoles("admin", "tpo"),
  deleteJobByAdmin
);

export default router;