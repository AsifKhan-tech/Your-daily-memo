import * as authService from "./auth.service.js";
import Apiresponse from "../../../src/common/utils/api-response.js";

// user registration controller
const register = async (req, res) => {
  const user = await authService.register(req.body);
  Apiresponse.created(res, "Registration successfull", user);
};

// Verify registered user's email controller
const verifyEmail = async (req, res) => {
  await authService.verifyEmail(req.params.token);
  Apiresponse.ok(res, "email verified successfully");
};

// Re-send email to the user to verify its email controller, if it didn't get due to any reason
const resendVerificationEmail = async (req, res) => {
  await authService.resendVerificationEmail(req.body.email);
  Apiresponse.ok(res, "verification email resent successfully");
};

// User login controller
const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);

  /**
   * sending refresh token in cookie
   * frontend cann't read the cookie because 'httpOnly: true'
   * It prevents the XSS(Cross-Site scripting) attack
   *
   * secure: process.env.NODE_ENV === "production"
   * This cookie will only transfer on HTTPS connections in 'production environment'
   *
   * sameSite: "strict" => Ensures that the cookie is sent on only with requests to your own domain.
   * It protects the server against 'CSRF (Cross-Site Request Forgery)' attacks
   */

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  /**
   * sending access token in cookie
   * frontend cann't read the cookie because 'httpOnly: true'
   * It prevents the XSS(Cross-Site scripting) attack
   *
   * secure: process.env.NODE_ENV === "production"
   * This cookie will only transfer on HTTPS connections in 'production environment'
   *
   * sameSite: "strict" => Ensures that the cookie is sent on only with requests to your own domain.
   * It protects the server against 'CSRF (Cross-Site Request Forgery)' attacks
   */

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  Apiresponse.ok(res, "User login successfully", {
    user,
    accessToken,
    refreshToken,
  });
};

// Token refresh controller
const refreshToken = async (req, res) => {
  const token = req.cookies?.refreshToken;

  const { accessToken } = authService.refresh(token);
  Apiresponse.ok(res, "Refreshed the token", { accessToken });
};

// User logout controller
const logout = async (req, res) => {
  //extract user's id
  await authService.logout(req.user.id);
  //clear cookie
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  Apiresponse.ok(res, "Logout successfully");
};

//forgot password controller
const forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.body.email);
  Apiresponse.ok(res, "password reset email sent");
};

// reset password controller
const resetPassword = async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  Apiresponse.ok(res, "password reset successfully");
};

// user profile controller
const profile = async (req, res) => {
  const user = await authService.profile(req.user.id);
  Apiresponse.ok(res, "User profile", user);
};

export {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  profile,
  resendVerificationEmail,
};
