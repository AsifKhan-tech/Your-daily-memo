import { useState } from "react";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [editingTodoId, setEditingTodoId] = useState(null);

  function addTodo(newTodo) {
    const todo = {
      id: crypto.randomUUID(),
      memo: newTodo.memo,
      dateTime: newTodo.dateTime,
      completed: false,
    };

    setTodos((currentTodos) => [...currentTodos, todo]);
  }

  function toggleTodo(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function deleteTodo(todoId) {
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    );

    setEditingTodoId((currentId) => (currentId === todoId ? null : currentId));
  }

  function startEditingTodo(todoId) {
    setEditingTodoId(todoId);
  }

  function saveTodo(todoId, updatedMemo) {
    const trimmedMemo = updatedMemo.memo.trim();

    if (!trimmedMemo || !updatedMemo.dateTime) {
      return false;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              memo: trimmedMemo,
              dateTime: updatedMemo.dateTime,
            }
          : todo,
      ),
    );

    setEditingTodoId(null);
    return true;
  }

  function cancelEditingTodo() {
    setEditingTodoId(null);
  }

  return {
    todos,
    editingTodoId,
    addTodo,
    toggleTodo,
    deleteTodo,
    startEditingTodo,
    saveTodo,
    cancelEditingTodo,
  };
}
