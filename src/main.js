//import pure functions and data layers to maintain separation of concerns.
import {
  formatDateTime,
  getCurrentLocalDateTime,
  generateId,
} from "./js/utils.js";
import { loadTodos, saveTodos } from "./js/storage.js";

// --- 2. DOM Elements ---
const form = document.querySelector(".todo-form");
const todoInput = document.querySelector("#todo");
const dateTimeInput = document.querySelector("#todo-date-time");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");

// --- 3. Application State ---
/**
 * Application state holding the list of todos.
 * @type {Array<{id: string, memo: string, dateTime: string, completed: boolean}>}
 */
let todos = loadTodos();

// --- 4. UI specific Utility Functions ---

/**
 * Updates the UI to reflect the total count of todos and toggles the empty state message.
 */
function updateMemoCount() {
  todoCount.textContent = todos.length;
  emptyState.hidden = todos.length > 0;
}

/**
 * Creates and configures an SVG icon element for the edit button.
 * @returns {SVGSVGElement} The constructed SVG element.
 */
function createEditIcon() {
  const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("aria-hidden", "true");
  icon.setAttribute("fill", "none");
  icon.setAttribute("stroke", "currentColor");
  icon.setAttribute("stroke-width", "2");
  icon.setAttribute("stroke-linecap", "round");
  icon.setAttribute("stroke-linejoin", "round");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z",
  );
  icon.append(path);
  return icon;
}

// --- 5. Rendering Engine ---

/**
 * Constructs the DOM elements for a single todo item and attaches event listeners.
 * @param {Object} todo - The data object representing a single todo.
 */
function renderTodo(todo) {
  const item = document.createElement("li");
  item.className = "todo-row";

  const itemText = document.createElement("span");
  itemText.className = "todo-item-text";
  itemText.textContent = todo.memo;

  const itemDetails = document.createElement("span");
  itemDetails.className = "todo-item-details";
  itemDetails.textContent = formatDateTime(todo.dateTime);

  const itemContent = document.createElement("div");
  itemContent.className = "todo-item-content";
  itemContent.append(itemText, itemDetails);

  const todoCard = document.createElement("div");
  todoCard.className = "todo-item";
  todoCard.classList.toggle("is-complete", Boolean(todo.completed));

  const completeToggle = document.createElement("input");
  completeToggle.className = "todo-checkbox";
  completeToggle.type = "checkbox";
  completeToggle.checked = Boolean(todo.completed);
  completeToggle.setAttribute("aria-label", `Mark ${todo.memo} completed`);

  const editButton = document.createElement("button");
  editButton.className = "edit-todo";
  editButton.type = "button";
  editButton.disabled = Boolean(todo.completed);
  editButton.setAttribute("aria-label", `Edit ${todo.memo}`);
  editButton.append(createEditIcon());

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-todo";
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${todo.memo}`);

  let isEditing = false;
  let editInput;

  /**
   * Internal helper to save edits, update the DOM, and persist state.
   */
  function saveEdit() {
    const updatedMemo = editInput.value.trim();
    if (!updatedMemo) {
      editInput.focus();
      return;
    }
    todo.memo = updatedMemo;
    todo.dateTime = getCurrentLocalDateTime(); // Using imported util
    itemText.textContent = todo.memo;
    itemDetails.textContent = formatDateTime(todo.dateTime); // Using imported util
    itemContent.replaceChild(itemText, editInput);
    todoCard.classList.remove("is-editing");
    editButton.disabled = todo.completed;
    editButton.setAttribute("aria-label", `Edit ${todo.memo}`);
    completeToggle.setAttribute("aria-label", `Mark ${todo.memo} completed`);
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${todo.memo}`);
    isEditing = false;
    saveTodos(todos); // Passing state to the imported storage function
  }

  // Event Listeners for the Todo Item
  completeToggle.addEventListener("change", () => {
    todo.completed = completeToggle.checked;
    todoCard.classList.toggle("is-complete", todo.completed);
    editButton.disabled = todo.completed;
    saveTodos(todos);
  });

  editButton.addEventListener("click", () => {
    if (isEditing || todo.completed) return;
    isEditing = true;
    editInput = document.createElement("input");
    editInput.className = "todo-edit-input";
    editInput.type = "text";
    editInput.value = todo.memo;
    editInput.setAttribute("aria-label", "Edit memo");
    itemContent.replaceChild(editInput, itemText);
    todoCard.classList.add("is-editing");
    editButton.disabled = true;
    deleteButton.textContent = "Save";
    deleteButton.setAttribute("aria-label", "Save memo changes");

    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveEdit();
      }
    });

    editInput.focus();
    editInput.select();
  });

  deleteButton.addEventListener("click", () => {
    if (isEditing) {
      saveEdit();
      return;
    }
    // Filter out the deleted item from state
    todos = todos.filter((savedTodo) => savedTodo.id !== todo.id);
    item.remove();
    updateMemoCount();
    saveTodos(todos);
  });

  todoCard.append(completeToggle, itemContent, editButton);
  item.append(todoCard, deleteButton);
  todoList.append(item);
}

// --- 6. Form Submission ---

todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.isComposing) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const memo = todoInput.value.trim();
  if (!memo || !dateTimeInput.value) {
    todoInput.focus();
    return;
  }

  const todo = {
    id: generateId(), // Using imported util
    memo,
    dateTime: dateTimeInput.value,
    completed: false,
  };

  todos.push(todo);
  renderTodo(todo);
  updateMemoCount();
  saveTodos(todos);

  form.reset();
  todoInput.focus();
});

// --- 7. Initialization ---
todos.forEach(renderTodo);
updateMemoCount();
