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

//register route
router.post("/register", validateMiddlewareFunction(RegisterDto), authController.register);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verifies the user's email using the unique token sent to their inbox.
 *
 * 🛠️ ARCHITECTURE NOTE (Dynamic Route Parameters):
 * The colon (`:`) in `:token` acts as a wildcard/placeholder in Express.js routing.
 * It instructs the Express engine that this part of the URL is dynamic.
 * When a user visits `/verify-email/xyz123`, Express automatically extracts `xyz123`
 * from the URL and securely binds it to the `req.params.token` object for us to use.
 *
 * @param {Object} req - The Express request object. `req.params.token` contains the extracted token.
 * @param {Object} res - The Express response object used to send the success/failure response.
 */

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verifies the user's email using the unique token.
 *
 * 🛠️ ARCHITECTURE NOTE (Why URL instead of Body?):
 * Since this endpoint is triggered directly via an email hyperlink click,
 * the browser forces an HTTP GET request. By standard HTTP specifications,
 * GET requests should not carry a request Body. Therefore, the verification
 * token MUST be passed dynamically through the URL path parameters.
 * This enables a seamless 1-click verification experience for the user.
 *
 * @param {Object} req - Express request object. Token is extracted from `req.params.token`.
 * @param {Object} res - Express response object.
 */

//email verification route
router.get("/verify-email/:token", authController.verifyEmail);

//email re-send verification route (if email doesn't send in email verification)
router.post(
  "/resend-verification",
  validateMiddlewareFunction(ForgotPasswordDto), // using this because it validates email
  authController.resendVerificationEmail,
);

//login route
router.post("/login", validateMiddlewareFunction(LoginDto), authController.login);

//token refresh route
// This route call when access token has been expire
router.post("/refresh-token", authController.refreshToken);

//logout route
router.post("/logout", authenticate, authController.logout);

// forgot password route
router.post("/forgot-password", validateMiddlewareFunction(ForgotPasswordDto), authController.forgotPassword);

//reset password route
router.put("/reset-password/:token", validateMiddlewareFunction(ResetPasswordDto), authController.resetPassword);

//profile route
router.get("/profile", authenticate, authController.profile);

export default router;
