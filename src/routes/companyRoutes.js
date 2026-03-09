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

router.get("/companies/my/profile", getMyCompanyProfile);
router.put("/companies/my/profile", updateMyCompanyProfile);

router.post("/companies/my/logo", upload.single("logo"), uploadCompanyLogo);

router.get("/companies/my/dashboard", getCompanyDashboard);

export default router;