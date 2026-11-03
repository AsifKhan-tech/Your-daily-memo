import { Router } from "express";
import * as todoController from "./todo.controller.js";
import { authenticate } from "../auth/auth.middleware.js";
import validateMiddlewareFunction from "../../common/middleware/validate.middleware.js";
import TodoDto from "./dto/todo.dto.js";
import UpdateTodoDto from "./dto/update-todo.dto.js";
import ToggleAllTodosDto from "./dto/toggle-all-todos.dto.js";

const router = Router();

// All memo endpoints are scoped to the authenticated user.
router.use(authenticate);

router.get("/", todoController.getTodos);
router.post("/", validateMiddlewareFunction(TodoDto), todoController.createTodo);

router.patch(
  "/bulk/completed",
  validateMiddlewareFunction(ToggleAllTodosDto),
  todoController.toggleAllTodos,
);
router.delete("/", todoController.deleteAllTodos);

router.patch(
  "/:todoId",
  validateMiddlewareFunction(UpdateTodoDto),
  todoController.updateTodo,
);
router.delete("/:todoId", todoController.deleteTodo);

export default router;
