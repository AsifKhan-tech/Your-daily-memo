import { useEffect, useState } from "react";

import { todoService } from "../services/todoService.js";
import { useAuth } from "../../auth/context/AuthContext.jsx";

function getCurrentLocalDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export function useTodos() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Selected Todo IDs for bulk deletion
  const [selectedTodoIds, setSelectedTodoIds] = useState([]);

  // Fetch todos after authentication is restored.
  useEffect(() => {
    let isActive = true;

    async function fetchTodos() {
      if (isAuthLoading) return;

      if (!isAuthenticated) {
        setTodos([]);
        setSelectedTodoIds([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const savedTodos = await todoService.getTodos();

        if (isActive) {
          setTodos(savedTodos);
          setSelectedTodoIds([]);
        }
      } catch (error) {
        if (isActive) {
          setError("Could not load your todos. Please try again.");
          console.error("Failed to load todos:", error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchTodos();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated, isAuthLoading, retryCount]);

  // Select or deselect an individual todo.
  function toggleTodoSelection(todoId) {
    setSelectedTodoIds((currentIds) => {
      if (currentIds.includes(todoId)) {
        return currentIds.filter((id) => id !== todoId);
      }

      return [...currentIds, todoId];
    });
  }

  // Select or deselect all todos.
  function selectAllTodos(shouldSelect) {
    if (shouldSelect) {
      setSelectedTodoIds(todos.map((todo) => todo.id));
    } else {
      setSelectedTodoIds([]);
    }
  }

  // Delete selected todos.
  async function deleteSelectedTodos() {
    if (selectedTodoIds.length === 0) return;

    const idsToDelete = selectedTodoIds;

    setError("");

    try {
      await todoService.deleteSelectedTodos(idsToDelete);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => !idsToDelete.includes(todo.id)),
      );

      setSelectedTodoIds([]);

      setEditingTodoId((currentId) =>
        idsToDelete.includes(currentId) ? null : currentId,
      );
    } catch (error) {
      setError("Could not delete selected todos. Please try again.");
      console.error("Failed to delete selected todos:", error);
    }
  }

  // Retry loading todos.
  function retryLoading() {
    setRetryCount((count) => count + 1);
  }

  // Add a new todo.
  async function addTodo(newTodo) {
    setError("");

    try {
      const createdTodo = await todoService.createTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, createdTodo]);

      return createdTodo;
    } catch (error) {
      setError("Could not add the todo. Please try again.");
      console.error("Failed to add todo:", error);

      return null;
    }
  }

  // Mark a todo complete or incomplete.
  async function toggleTodo(todoId) {
    const todo = todos.find((item) => item.id === todoId);

    if (!todo) return;

    setError("");

    try {
      const updatedTodo = await todoService.updateTodo(todoId, {
        completed: !todo.completed,
      });

      setTodos((currentTodos) =>
        currentTodos.map((item) => (item.id === todoId ? updatedTodo : item)),
      );
    } catch (error) {
      setError("Could not update the todo. Please try again.");
      console.error("Failed to update todo:", error);
    }
  }

  // Delete an individual todo.
  async function deleteTodo(todoId) {
    setError("");

    try {
      await todoService.deleteTodo(todoId);

      setTodos((currentTodos) =>
        currentTodos.filter((todo) => todo.id !== todoId),
      );

      setEditingTodoId((currentId) =>
        currentId === todoId ? null : currentId,
      );

      setSelectedTodoIds((currentIds) =>
        currentIds.filter((id) => id !== todoId),
      );
    } catch (error) {
      setError("Could not delete the todo. Please try again.");
      console.error("Failed to delete todo:", error);
    }
  }

  // Enter edit mode.
  function startEditingTodo(todoId) {
    setEditingTodoId(todoId);
  }

  // Save edited memo.
  async function saveTodo(todoId, updatedMemo) {
    const trimmedMemo = updatedMemo.memo.trim();

    if (!trimmedMemo) {
      return false;
    }

    setError("");

    try {
      const updatedTodo = await todoService.updateTodo(todoId, {
        memo: trimmedMemo,
      });

      setTodos((currentTodos) =>
        currentTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo)),
      );

      setEditingTodoId(null);

      return true;
    } catch (error) {
      setError("Could not save your changes. Please try again.");
      console.error("Failed to save todo:", error);

      return false;
    }
  }

  // Exit edit mode without saving.
  function cancelEditingTodo() {
    setEditingTodoId(null);
  }

  // Delete every todo. The list enables this only when all todos are complete.
  async function deleteAllTodos() {
    if (todos.length === 0) return;

    const idsToDelete = todos.map((todo) => todo.id);

    setError("");

    try {
      await todoService.deleteAllTodos(idsToDelete);

      setTodos([]);
      setSelectedTodoIds([]);
      setEditingTodoId(null);
    } catch (error) {
      setError("Could not delete all todos. Please try again.");
      console.error("Failed to delete all todos:", error);
    }
  }

  // Mark all todos complete or incomplete.
  async function toggleAllTodos(shouldComplete) {
    setError("");

    try {
      for (const todo of todos) {
        if (todo.completed === shouldComplete) continue;

        const updatedTodo = await todoService.updateTodo(todo.id, {
          completed: shouldComplete,
        });

        setTodos((currentTodos) =>
          currentTodos.map((item) =>
            item.id === todo.id ? updatedTodo : item,
          ),
        );
      }
    } catch (error) {
      setError("Could not update all todos. Please try again.");
      console.error("Failed to update all todos:", error);
    }
  }

  return {
    todos,
    isLoading,
    error,
    retryLoading,
    editingTodoId,

    // CRUD operations
    addTodo,
    toggleTodo,
    deleteTodo,
    toggleAllTodos,
    deleteAllTodos,
    startEditingTodo,
    saveTodo,
    cancelEditingTodo,

    // Selection and bulk deletion
    selectedTodoIds,
    toggleTodoSelection,
    selectAllTodos,
    deleteSelectedTodos,
  };
}
