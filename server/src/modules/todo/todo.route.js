import { Router } from "express";

import * as todoController from "./todo.controller.jsx";
import { authenticate } from "../auth/auth.middleware.js";
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import TodoDto from "./dto/todo.dto.js";

const router = Router();

router.get("/", authenticate, todoController.getTodos);

router.post("/", authenticate, validateMiddlewareFunction(TodoDto), todoController.createTodo);

export default router;
