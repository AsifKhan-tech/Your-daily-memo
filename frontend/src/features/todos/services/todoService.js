import { loadTodos, saveTodos } from "../storage.js";

export const todoService = {
  async getTodos() {
    return loadTodos();
  },

  async createTodo(todo) {
    const todos = loadTodos();
    const updatedTodos = [...todos, todo];

    saveTodos(updatedTodos);

    return todo;
  },

  async updateTodo(todoId, updates) {
    const todos = loadTodos();

    const updatedTodos = todos.map((todo) =>
      todo.id === todoId ? { ...todo, ...updates } : todo,
    );

    saveTodos(updatedTodos);

    return updatedTodos.find((todo) => todo.id === todoId) ?? null;
  },

  async deleteTodo(todoId) {
    const todos = loadTodos();
    const updatedTodos = todos.filter((todo) => todo.id !== todoId);

    saveTodos(updatedTodos);

    return true;
  },
};
