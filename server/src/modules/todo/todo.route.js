import { Router } from "express";

import * as todoController from "./todo.controller.jsx";
import { authenticate } from "../auth/auth.middleware.js";

// validate the request
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import TodoDTO from "./dto/todo.dto.js";
import UpdateDTO from "./dto/update-todo.dto.js";

const router = Router();

router.get("/", authenticate, todoController.getTodos);

router.post("/", authenticate, validateMiddlewareFunction(TodoDTO), todoController.createTodo);

router.patch("/:todoId", authenticate, validateMiddlewareFunction(UpdateDTO), todoController.updateTodo);
export default router;
