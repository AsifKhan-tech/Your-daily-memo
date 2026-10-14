import { Router } from "express";

import * as authController from "./auth.controller.js";
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import RegisterDto from "./dto/register.dto.js";
import LoginDto from "./dto/login.dto.js";
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

router.post("/logout", authenticate, authController.logout);

router.get("/get-me", authenticate, authController.getMe);

export default router;
