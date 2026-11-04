import * as todoService from "./todo.service.js";
import Apiresponse from "../../common/utils/api-response.js";

// Get all todos
const getTodos = async (req, res) => {
  const todos = await todoService.getTodos(req.user.id);

  Apiresponse.ok(res, "Todos retrieved successfully", todos);
};

// Create a todo
const createTodo = async (req, res) => {
  const todo = await todoService.createTodo(req.user.id, req.body);

  Apiresponse.created(res, "Todo created successfully", todo);
};

// Update a todo
const updateTodo = async (req, res) => {
  const todo = await todoService.updateTodo(req.user.id, req.params.todoId, req.body);

  Apiresponse.ok(res, "Todo updated successfully", todo);
};

// Delete a todo
const deleteTodo = async (req, res) => {
  await todoService.deleteTodo(req.user.id, req.params.todoId);

  Apiresponse.noContent(res);
};

// Delete multiple selected todos
const deleteSelectedTodos = async (req, res) => {
  const result = await todoService.deleteAllSelectedTodos(req.user.id, req.body.todoIds);

  Apiresponse.ok(res, "Selected todos deleted successfully", result);
};

export { getTodos, createTodo, updateTodo, deleteTodo, deleteSelectedTodos };
