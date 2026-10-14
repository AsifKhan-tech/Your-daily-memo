import * as authService from "./auth.service.js";
import Apiresponse from "../../../src/common/utils/api-response.js";

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    Apiresponse.created(res, "Registration successfull", user);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    Apiresponse.ok(res, "User login successfully", { user, accessToken });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export { register, login };
