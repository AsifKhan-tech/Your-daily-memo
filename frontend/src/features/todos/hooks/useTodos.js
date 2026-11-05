// import { useCallback, useEffect, useState } from "react";
// import { todoService } from "../services/todoService.js";

// function getCurrentLocalDateTime() {
//   const now = new Date();
//   const offset = now.getTimezoneOffset();
//   const localDate = new Date(now.getTime() - offset * 60_000);

//   return localDate.toISOString().slice(0, 16);
// }

// export function useTodos() {
//   const [todos, setTodos] = useState([]);
//   const [editingTodoId, setEditingTodoId] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [retryCount, setRetryCount] = useState(0);

//   // Load todos when the app starts or the user retries
//   useEffect(() => {
//     let isActive = true;

//     async function fetchTodos() {
//       setIsLoading(true);
//       setError("");

//       try {
//         const savedTodos = await todoService.getTodos();

//         if (isActive) {
//           setTodos(savedTodos);
//         }
//       } catch (error) {
//         if (isActive) {
//           setError("Could not load your memos. Please try again.");
//           console.error("Failed to load todos:", error);
//         }
//       } finally {
//         if (isActive) {
//           setIsLoading(false);
//         }
//       }
//     }

//     fetchTodos();

//     return () => {
//       isActive = false;
//     };
//   }, [retryCount]);

//   // Retry loading todos
//   function retryLoading() {
//     setRetryCount((count) => count + 1);
//   }

//   // Add a new todo
//   async function addTodo(newTodo) {
//     const todo = {
//       id: crypto.randomUUID(),
//       memo: newTodo.memo,
//       dateTime: newTodo.dateTime,
//       completed: false,
//     };

//     setError("");

//     try {
//       await todoService.createTodo(todo);
//       setTodos((currentTodos) => [...currentTodos, todo]);
//     } catch (error) {
//       setError("Could not add the memo. Please try again.");
//       console.error("Failed to add todo:", error);
//     }
//   }

//   // Mark a todo complete or incomplete
//   async function toggleTodo(todoId) {
//     const todo = todos.find((item) => item.id === todoId);

//     if (!todo) return;

//     const updates = {
//       completed: !todo.completed,
//     };

//     setError("");

//     try {
//       await todoService.updateTodo(todoId, updates);

//       setTodos((currentTodos) =>
//         currentTodos.map((item) =>
//           item.id === todoId ? { ...item, ...updates } : item,
//         ),
//       );
//     } catch (error) {
//       setError("Could not update the memo. Please try again.");
//       console.error("Failed to update todo:", error);
//     }
//   }

//   // Delete a todo
//   async function deleteTodo(todoId) {
//     setError("");

//     try {
//       await todoService.deleteTodo(todoId);

//       setTodos((currentTodos) =>
//         currentTodos.filter((todo) => todo.id !== todoId),
//       );

//       setEditingTodoId((currentId) =>
//         currentId === todoId ? null : currentId,
//       );
//     } catch (error) {
//       setError("Could not delete the memo. Please try again.");
//       console.error("Failed to delete todo:", error);
//     }
//   }

//   // Enter edit mode
//   function startEditingTodo(todoId) {
//     setEditingTodoId(todoId);
//   }

//   // Save edited memo
//   async function saveTodo(todoId, updatedMemo) {
//     const trimmedMemo = updatedMemo.memo.trim();

//     if (!trimmedMemo) {
//       return false;
//     }

//     const updates = {
//       memo: trimmedMemo,
//       dateTime: getCurrentLocalDateTime(),
//     };

//     setError("");

//     try {
//       await todoService.updateTodo(todoId, updates);

//       setTodos((currentTodos) =>
//         currentTodos.map((todo) =>
//           todo.id === todoId ? { ...todo, ...updates } : todo,
//         ),
//       );

//       setEditingTodoId(null);
//       return true;
//     } catch (error) {
//       setError("Could not save your changes. Please try again.");
//       console.error("Failed to save todo:", error);
//       return false;
//     }
//   }

//   // Exit edit mode without saving
//   function cancelEditingTodo() {
//     setEditingTodoId(null);
//   }

//   //delete all todos
//   async function toggleAllTodos(shouldComplete) {
//     setError("");

//     const updates = todos.map((todo) => ({
//       ...todo,
//       completed: shouldComplete,
//     }));

//     try {
//       // Save the entire updated list through the service.
//       for (const todo of updates) {
//         await todoService.updateTodo(todo.id, {
//           completed: shouldComplete,
//         });
//       }

//       setTodos(updates);
//     } catch (error) {
//       setError("Could not update all memos. Please try again.");
//       console.error("Failed to update all todos:", error);
//     }
//   }

//   async function deleteAllTodos() {
//     setError("");

//     try {
//       await todoService.deleteAllTodos();

//       setTodos([]);
//       setEditingTodoId(null);
//     } catch (error) {
//       setError("Could not delete all memos. Please try again.");
//       console.error("Failed to delete all todos:", error);
//     }
//   }

//   // return {
//   //   todos,
//   //   isLoading,
//   //   error,
//   //   retryLoading,
//   //   editingTodoId,
//   //   addTodo,
//   //   toggleTodo,
//   //   deleteTodo,
//   //   startEditingTodo,
//   //   saveTodo,
//   //   cancelEditingTodo,
//   // };

//   return {
//     todos,
//     isLoading,
//     error,
//     retryLoading,
//     editingTodoId,
//     addTodo,
//     toggleTodo,
//     deleteTodo,
//     toggleAllTodos,
//     deleteAllTodos,
//     startEditingTodo,
//     saveTodo,
//     cancelEditingTodo,
//   };
// }

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

  // Fetch todos after authentication is restored.
  useEffect(() => {
    let isActive = true;

    async function fetchTodos() {
      if (isAuthLoading) return;

      if (!isAuthenticated) {
        setTodos([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const savedTodos = await todoService.getTodos();

        if (isActive) {
          setTodos(savedTodos);
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

  // Delete a todo.
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

  // Delete all todos.
  async function deleteAllTodos() {
    setError("");

    try {
      await todoService.deleteAllTodos(todos.map((todo) => todo.id));

      setTodos([]);
      setEditingTodoId(null);
    } catch (error) {
      setError("Could not delete all todos. Please try again.");
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
