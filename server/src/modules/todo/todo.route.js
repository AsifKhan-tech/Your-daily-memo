import { Router } from "express";

import * as todoController from "./todo.controller.jsx";
import { authenticate } from "../auth/auth.middleware.js";

// validate the request
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import CreateTodoDTO from "./dto/todo.dto.js";
import UpdateTodoDTO from "./dto/update-todo.dto.js";

const router = Router();

router.get("/", authenticate, todoController.getTodos);

router.post("/", authenticate, validateMiddlewareFunction(CreateTodoDTO), todoController.createTodo);

router.patch("/:todoId", authenticate, validateMiddlewareFunction(UpdateTodoDTO), todoController.updateTodo);

router.delete("/:todoId", authenticate, todoController.deleteTodo);

export default router;
