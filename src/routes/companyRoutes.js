import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import multer from "multer";

import {
  getMyCompanyProfile,
  updateMyCompanyProfile,
  uploadCompanyLogo,
  getCompanyDashboard,
} from "../controllers/companyController.js";

const router = express.Router();

/* simple image upload */
const upload = multer({ storage: multer.memoryStorage() });

router.use(protect, allowRoles("company"));

router.get("/me/profile", getMyCompanyProfile);
router.put("/me/profile", updateMyCompanyProfile);

router.post("/me/logo", upload.single("logo"), uploadCompanyLogo);

router.get("/me/dashboard", getCompanyDashboard);

export default router;