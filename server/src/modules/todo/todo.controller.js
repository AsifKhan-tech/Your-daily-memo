import * as todoService from "./todo.service.js";
import Apiresponse from "../../common/utils/api-response.js";

const getTodos = async (req, res) => {
  const todos = await todoService.getTodos(req.user.id);
  Apiresponse.ok(res, "Memos retrieved successfully", todos);
};

const createTodo = async (req, res) => {
  const todo = await todoService.createTodo(req.user.id, req.body);
  Apiresponse.created(res, "Memo created successfully", todo);
};

const updateTodo = async (req, res) => {
  const todo = await todoService.updateTodo(
    req.user.id,
    req.params.todoId,
    req.body,
  );

  Apiresponse.ok(res, "Memo updated successfully", todo);
};

const deleteTodo = async (req, res) => {
  await todoService.deleteTodo(req.user.id, req.params.todoId);
  Apiresponse.ok(res, "Memo deleted successfully");
};

const toggleAllTodos = async (req, res) => {
  const todos = await todoService.toggleAllTodos(
    req.user.id,
    req.body.completed,
  );

  Apiresponse.ok(res, "Memos updated successfully", todos);
};

const deleteAllTodos = async (req, res) => {
  const deletedCount = await todoService.deleteAllTodos(req.user.id);

  Apiresponse.ok(res, "All memos deleted successfully", { deletedCount });
};

export {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleAllTodos,
  deleteAllTodos,
};
