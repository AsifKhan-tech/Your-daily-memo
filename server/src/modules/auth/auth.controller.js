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

export { register };
