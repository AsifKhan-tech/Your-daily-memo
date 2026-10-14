import { Router } from "express";

import * as authController from "./auth.controller.js";
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import Registerdto from "./dto/register.dto.js";
// This class actually validate the reqest

const router = Router();

router.post(
  "/register",
  validateMiddlewareFunction(Registerdto),
  authController.register,
);

router.post(
  "/login",
  validateMiddlewareFunction(LoginDto),
  authController.login,
);

router.get("/get-me", authenticate, authController.getMe);

export default router;
