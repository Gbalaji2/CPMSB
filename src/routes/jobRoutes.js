import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

import {
  createJob,
  listJobs,
  getJobById,
  updateJob,
  closeJob,
} from "../controllers/jobController.js";

const router = express.Router();

/* Public list + details */
router.get("/", listJobs);
router.get("/:id", getJobById);

/* Company create/update */
router.post("/", protect, allowRoles("company"), createJob);
router.put("/:id", protect, allowRoles("company"), updateJob);
router.patch("/:id/close", protect, allowRoles("company"), closeJob);

export default router;