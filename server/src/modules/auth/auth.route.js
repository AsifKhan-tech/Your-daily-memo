import { Router } from "express";

import * as authController from "./auth.controller.js";
import validateMiddleware from "../../common/middleware/validate.middleware.js";
import Registerdto from "./dto/register.dto.js";

const router = Router();

router.post(
  "/register",
  validateMiddleware(Registerdto),
  authController.register,
);

export default router;
