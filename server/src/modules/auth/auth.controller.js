import * as authService from "./auth.service.js";
import Apiresponse from "../../../src/common/utils/api-response.js";

const register = async (req, res) => {
  const user = await authService.register(req.body);
  Apiresponse.created(res, "Registration successfull", user);
};

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

const logout = async (req, res) => {
  //extract user's id
  await authService.logout(req.user._id);
  //clear cookie
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  Apiresponse.ok(res, "logout successfully");
};

const profile = async (req, res) => {
  const user = await authService.profile(req.user._id);
  Apiresponse.ok(res, "User profile", user);
};

export { register, login, logout, profile };
