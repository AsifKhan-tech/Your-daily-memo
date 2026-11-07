import { Router } from "express";

import * as contactController from "./contact.controller.js";
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import ContactDTO from "./dto/contact.dto.js";

const router = Router();

router.post("/", validateMiddlewareFunction(ContactDTO), contactController.createContact);

export default router;