import { apiRequest } from "../../../lib/apiClient.js";
import { validateCreateTodoDto } from "../dto/createTodo.dto.js";
import { validateUpdateTodoDto } from "../dto/updateTodo.dto.js";
import { validateBulkDeleteTodosDto } from "../dto/bulkDeleteTodos.dto.js";

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

function getValidatedData(validation) {
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors).join(" "));
  }

  return validation.data;
}

export const todoApiService = {
  // Retrieve all todos
  async getTodos() {
    const response = await apiRequest("/todos");

    return response.data.map(normalizeTodo);
  },

  // Create a todo
  async createTodo(todo) {
    const validatedTodo = getValidatedData(
      validateCreateTodoDto({
        todo: todo.memo,
        dateTime: todo.dateTime,
      }),
    );

    const response = await apiRequest("/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: validatedTodo.todo,
        dateTime: validatedTodo.dateTime.toISOString(),
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
      payload.dateTime = updates.dateTime;
    }

    if (updates.completed !== undefined) {
      payload.completed = updates.completed;
    }

    const validatedUpdates = getValidatedData(validateUpdateTodoDto(payload));
    if (validatedUpdates.dateTime) {
      validatedUpdates.dateTime = validatedUpdates.dateTime.toISOString();
    }

    const response = await apiRequest(`/todos/${encodeURIComponent(todoId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedUpdates),
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
    const validatedPayload = getValidatedData(
      validateBulkDeleteTodosDto({ todoIds }),
    );

    const response = await apiRequest("/todos/bulk-delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedPayload),
    });

    return response.data.deletedCount;
  },
};
