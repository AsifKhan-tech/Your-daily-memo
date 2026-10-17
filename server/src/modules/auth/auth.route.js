import { Router } from "express";

import * as authController from "./auth.controller.js";
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";

// DTO
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
import ForgotPasswordDto from "./dto/forgotPassword.dto.js";
import ResetPasswordDto from "./dto/resetPassword.dto.js";

//Authentication middleware
import { authenticate } from "./auth.middleware.js";
// This class actually validate the reqest

const router = Router();

router.post(
  "/register",
  validateMiddlewareFunction(RegisterDto),
  authController.register,
);

router.post(
  "/login",
  validateMiddlewareFunction(LoginDto),
  authController.login,
);

router.post("/refresh-token", authenticate, authController.refreshToken);
router.post("/logout", authenticate, authController.logout);
router.get("/verify-email/:token", authController.verifyEmail);
router.post(
  "/forgot-password",
  validateMiddlewareFunction(ForgotPasswordDto),
  authController.forgotPassword,
);

router.put(
  "/reset-password/:token",
  validateMiddlewareFunction(ResetPasswordDto),
  authController.resetPassword,
);

router.get("/profile", authenticate, authController.profile);

export default router;
