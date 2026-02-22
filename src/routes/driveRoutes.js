import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  listDrives,
  getDriveById,
  createDrive,
  updateDrive,
} from "../controllers/driveController.js";

const router = express.Router();

/* Public */
router.get("/", listDrives);
router.get("/:id", getDriveById);

/* Admin/TPO */
router.post("/", protect, allowRoles("admin", "tpo"), createDrive);
router.put("/:id", protect, allowRoles("admin", "tpo"), updateDrive);

export default router;