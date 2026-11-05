import { apiRequest } from "../../../lib/apiClient.js";

// Import existing apiRequest()
// Create functions for each Todo API endpoint
// Convert function data into backend-compatible request data
// Convert backend responses into frontend-compatiable Todo objects
// Return the API results to the calling service

// Convert backend Todo into frontend Todo format.
function normalizeTodo(todo) {
  const date = new Date(todo.dateTime);
  const offset = date.getTimezoneOffset();

  const localDateTime = new Date(date.getTime() - offset * 60_000)
    .toISOString()
    .slice(0, 16);

  return {
    id: todo._id,
    memo: todo.todo,
    dateTime: localDateTime,
    completed: todo.completed,
  };
}

// Convert frontend date into an ISO timestamp.
function toApiDateTime(dateTime) {
  return new Date(dateTime).toISOString();
}

export const todoApiService = {
  // Retrieve all todos
  async getTodos() {
    const response = await apiRequest("/todos");

    return response.data.map(normalizeTodo);
  },

  // Create a todo
  async createTodo(todo) {
    const response = await apiRequest("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: todo.memo,
        dateTime: toApiDateTime(todo.dateTime),
      }),
    });

    return normalizeTodo(response.data);
  },

  // Update a todo
  async updateTodo(todoId, updates) {
    const payload = {};

    if (updates.memo !== undefined) {
      payload.todo = updates.memo;
    }

    if (updates.dateTime !== undefined) {
      payload.dateTime = toApiDateTime(updates.dateTime);
    }

    if (updates.completed !== undefined) {
      payload.completed = updates.completed;
    }

    const response = await apiRequest(`/todos/${encodeURIComponent(todoId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return normalizeTodo(response.data);
  },

  // Delete a todo
  async deleteTodo(todoId) {
    await apiRequest(`/todos/${encodeURIComponent(todoId)}`, {
      method: "DELETE",
    });

    return true;
  },

  // Delete selected todos
  async deleteSelectedTodos(todoIds) {
    const response = await apiRequest("/todos/bulk-delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todoIds }),
    });

    return response.data.deletedCount;
  },
};
