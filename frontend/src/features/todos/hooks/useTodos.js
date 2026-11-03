import { useEffect, useState } from "react";
import { todoService } from "../services/todoService.js";

function getCurrentLocalDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

export function useTodos(enabled = true) {
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isActive = true;

    if (!enabled) {
      setTodos([]);
      setEditingTodoId(null);
      setError("");
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    async function fetchTodos() {
      setIsLoading(true);
      setError("");

      try {
        const savedTodos = await todoService.getTodos();
        if (isActive) setTodos(savedTodos);
      } catch (error) {
        if (isActive) {
          setError("Could not load your memos. Please try again.");
          console.error("Failed to load todos:", error);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    fetchTodos();
    return () => {
      isActive = false;
    };
  }, [enabled, retryCount]);

  function retryLoading() {
    setRetryCount((count) => count + 1);
  }

  async function addTodo(newTodo) {
    setError("");
    try {
      const createdTodo = await todoService.createTodo(newTodo);
      setTodos((currentTodos) => [...currentTodos, createdTodo]);
    } catch (error) {
      setError("Could not add the memo. Please try again.");
      console.error("Failed to add todo:", error);
    }
  }

  async function toggleTodo(todoId) {
    const todo = todos.find((item) => item.id === todoId);
    if (!todo) return;

    const updates = { completed: !todo.completed };
    setError("");
    try {
      const updatedTodo = await todoService.updateTodo(todoId, updates);
      setTodos((currentTodos) =>
        currentTodos.map((item) => item.id === todoId ? updatedTodo : item),
      );
    } catch (error) {
      setError("Could not update the memo. Please try again.");
      console.error("Failed to update todo:", error);
    }
  }

  async function deleteTodo(todoId) {
    setError("");
    try {
      await todoService.deleteTodo(todoId);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
      setEditingTodoId((currentId) => currentId === todoId ? null : currentId);
    } catch (error) {
      setError("Could not delete the memo. Please try again.");
      console.error("Failed to delete todo:", error);
    }
  }

  function startEditingTodo(todoId) {
    setEditingTodoId(todoId);
  }

  async function saveTodo(todoId, updatedMemo) {
    const trimmedMemo = updatedMemo.memo.trim();
    if (!trimmedMemo) return false;

    const updates = {
      memo: trimmedMemo,
      dateTime: getCurrentLocalDateTime(),
    };

    setError("");
    try {
      const savedTodo = await todoService.updateTodo(todoId, updates);
      setTodos((currentTodos) =>
        currentTodos.map((todo) => todo.id === todoId ? savedTodo : todo),
      );
      setEditingTodoId(null);
      return true;
    } catch (error) {
      setError("Could not save your changes. Please try again.");
      console.error("Failed to save todo:", error);
      return false;
    }
  }

  function cancelEditingTodo() {
    setEditingTodoId(null);
  }

  async function toggleAllTodos(shouldComplete) {
    setError("");
    try {
      const updatedTodos = await todoService.toggleAllTodos(shouldComplete);
      setTodos(updatedTodos);
    } catch (error) {
      setError("Could not update all memos. Please try again.");
      console.error("Failed to update all todos:", error);
    }
  }

  async function deleteAllTodos() {
    setError("");
    try {
      await todoService.deleteAllTodos();
      setTodos([]);
      setEditingTodoId(null);
    } catch (error) {
      setError("Could not delete all memos. Please try again.");
      console.error("Failed to delete all todos:", error);
    }
  }

  return {
    todos,
    isLoading,
    error,
    retryLoading,
    editingTodoId,
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleAllTodos,
    deleteAllTodos,
    startEditingTodo,
    saveTodo,
    cancelEditingTodo,
  };
}
