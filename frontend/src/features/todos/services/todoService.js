import { apiRequest } from "../../../lib/apiClient.js";

const normalizeTodo = (todo) => ({
  ...todo,
  id: todo._id,
  dateTime: todo.dateTime,
});

export const todoService = {
  async getTodos() {
    const response = await apiRequest("/todos");
    return response.data.map(normalizeTodo);
  },

  async createTodo(todo) {
    const response = await apiRequest("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memo: todo.memo,
        dateTime: new Date(todo.dateTime).toISOString(),
      }),
    });
    return normalizeTodo(response.data);
  },

  async updateTodo(todoId, updates) {
    const payload = { ...updates };
    if (payload.dateTime) {
      payload.dateTime = new Date(payload.dateTime).toISOString();
    }

    const response = await apiRequest(`/todos/${todoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return normalizeTodo(response.data);
  },

  async deleteTodo(todoId) {
    return apiRequest(`/todos/${todoId}`, { method: "DELETE" });
  },

  async toggleAllTodos(completed) {
    const response = await apiRequest("/todos/bulk/completed", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    return response.data.map(normalizeTodo);
  },

  async deleteAllTodos() {
    return apiRequest("/todos", { method: "DELETE" });
  },
};
