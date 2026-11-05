import { useState, useEffect } from "react";
import { formatDateTime } from "../../../lib/utils.js";

function TodoList({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo,
  editingTodoId,
  onSaveTodo,
  onCancelEdit,
  onToggleAll,
  onDeleteAll,

  // Selection functionality
  selectedTodoIds = [],
  onToggleTodoSelection,
  onSelectAllTodos,
  onDeleteSelectedTodos,
}) {
  const [editingMemo, setEditingMemo] = useState("");

  useEffect(() => {
    const todoToEdit = todos.find((todo) => todo.id === editingTodoId);

    if (todoToEdit) {
      setEditingMemo(todoToEdit.memo);
    }
  }, [editingTodoId, todos]);

  function handleSave(todoId) {
    onSaveTodo(todoId, {
      memo: editingMemo,
    });
  }

  const allSelected =
    todos.length > 0 && selectedTodoIds.length === todos.length;

  return (
    <section
      className="todo-list-section"
      id="todos"
      aria-labelledby="list-title"
    >
      <div className="list-heading">
        <h2 id="list-title">All tasks</h2>
        <span className="todo-count">{todos.length}</span>
      </div>

      <div className="list-actions">
        {/* Completion controls */}
        <label className="all-items-control" htmlFor="all-items">
          <input
            id="all-items"
            className="todo-checkbox"
            type="checkbox"
            checked={todos.length > 0 && todos.every((todo) => todo.completed)}
            onChange={(event) => onToggleAll(event.target.checked)}
            disabled={todos.length === 0}
          />

          <span>All items</span>
        </label>

        {/* Selection controls */}
        <label className="select-all-control" htmlFor="select-all-todos">
          <input
            id="select-all-todos"
            type="checkbox"
            checked={allSelected}
            onChange={(event) => onSelectAllTodos(event.target.checked)}
            disabled={todos.length === 0}
          />

          <span>Select All</span>
        </label>

        {/* Delete selected todos */}
        <button
          className="delete-selected"
          type="button"
          onClick={onDeleteSelectedTodos}
          disabled={selectedTodoIds.length === 0}
        >
          Delete Selected ({selectedTodoIds.length})
        </button>

        {/* Existing delete all functionality */}
        <button
          className="delete-all"
          type="button"
          onClick={onDeleteAll}
          disabled={
            todos.length === 0 || !todos.every((todo) => todo.completed)
          }
        >
          Delete all
        </button>
      </div>

      {todos.length === 0 ? (
        <p className="empty-state">Your added tasks will appear here.</p>
      ) : (
        <ul className="todo-list" aria-live="polite">
          {todos.map((todo) => {
            const isEditing = editingTodoId === todo.id;

            const isSelected = selectedTodoIds.includes(todo.id);

            return (
              <li className="todo-row" key={todo.id}>
                {/* Selection checkbox */}
                <input
                  className="todo-selection-checkbox"
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleTodoSelection(todo.id)}
                  disabled={isEditing}
                  aria-label={`Select ${todo.memo} for deletion`}
                />

                <div
                  className={`todo-item ${todo.completed ? "is-complete" : ""}`}
                >
                  {/* Completion checkbox */}
                  <input
                    className="todo-checkbox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => onToggleTodo(todo.id)}
                    disabled={isEditing}
                    aria-label={`Mark "${todo.memo}" as ${
                      todo.completed ? "incomplete" : "complete"
                    }`}
                  />

                  <div className="todo-item-content">
                    {isEditing ? (
                      <input
                        className="todo-edit-input"
                        type="text"
                        value={editingMemo}
                        onChange={(event) => setEditingMemo(event.target.value)}
                        aria-label="Edit memo"
                        autoFocus
                      />
                    ) : (
                      <>
                        <span className="todo-item-text">{todo.memo}</span>

                        <span className="todo-item-details">
                          {formatDateTime(todo.dateTime)}
                        </span>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      className="edit-todo"
                      type="button"
                      onClick={() => onEditTodo(todo.id)}
                      aria-label={`Edit ${todo.memo}`}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="todo-edit-actions">
                    <button
                      className="edit-todo"
                      type="button"
                      onClick={() => handleSave(todo.id)}
                    >
                      Save
                    </button>

                    <button
                      className="delete-todo"
                      type="button"
                      onClick={onCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="delete-todo"
                    type="button"
                    onClick={() => onDeleteTodo(todo.id)}
                    aria-label={`Delete ${todo.memo}`}
                  >
                    Delete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default TodoList;
