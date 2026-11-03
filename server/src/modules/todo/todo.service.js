import mongoose from "mongoose";

import ApiError from "../../common/utils/api-error.js";
import Todo from "./todo.model.js";

const assertValidTodoId = (todoId) => {
  if (!mongoose.isValidObjectId(todoId)) {
    throw ApiError.badRequest("Invalid memo ID");
  }
};

const getTodos = async (userId) => {
  return Todo.find({ user: userId }).sort({ createdAt: 1 });
};

const createTodo = async (userId, todoData) => {
  return Todo.create({
    ...todoData,
    user: userId,
    completed: false,
  });
};

const updateTodo = async (userId, todoId, updates) => {
  assertValidTodoId(todoId);

  const todo = await Todo.findOneAndUpdate(
    { _id: todoId, user: userId },
    { $set: updates },
    { returnDocument: "after", runValidators: true },
  );

  if (!todo) {
    throw ApiError.notFound("Memo not found");
  }

  return todo;
};

const deleteTodo = async (userId, todoId) => {
  assertValidTodoId(todoId);

  const todo = await Todo.findOneAndDelete({
    _id: todoId,
    user: userId,
  });

  if (!todo) {
    throw ApiError.notFound("Memo not found");
  }

  return todo;
};

const toggleAllTodos = async (userId, completed) => {
  await Todo.updateMany(
    { user: userId },
    { $set: { completed } },
  );

  return getTodos(userId);
};

const deleteAllTodos = async (userId) => {
  const result = await Todo.deleteMany({ user: userId });
  return result.deletedCount;
};

export {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleAllTodos,
  deleteAllTodos,
};
