import express from "express";
import { validate } from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

import {
  register,
  login,
  refreshAccessToken,
  logout,
  getMe,
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

router.get("/refresh", refreshAccessToken);

router.post("/logout", logout);

router.get("/me", protect, getMe);

export default router;