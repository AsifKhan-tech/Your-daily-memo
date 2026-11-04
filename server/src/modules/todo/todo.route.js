import { Router } from "express";

import * as todoController from "./todo.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

// validate the request
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import CreateTodoDTO from "./dto/todo.dto.js";
import UpdateTodoDTO from "./dto/update-todo.dto.js";
import BulkDeleteTodosDTO from "./dto/bulk-delete.dto.js";

const router = Router();

router.get("/", authenticate, todoController.getTodos);

router.post("/", authenticate, validateMiddlewareFunction(CreateTodoDTO), todoController.createTodo);

router.patch("/:todoId", authenticate, validateMiddlewareFunction(UpdateTodoDTO), todoController.updateTodo);

router.delete("/:todoId", authenticate, todoController.deleteTodo);

/**
 * Why POST instead of DELETE?
 * Technically DELETE requests can have a body, but their body semantics are not consistently supported by all clients and intermediaries.
 */
router.post(
  "/bulk-delete",
  authenticate,
  validateMiddlewareFunction(BulkDeleteTodosDTO),
  todoController.deleteSelectedTodos,
);

export default router;
