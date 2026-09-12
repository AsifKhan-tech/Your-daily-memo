/**
 * UI entry point for Daily Memo.
 *
 * DOM rendering and event orchestration live here, while date formatting,
 * identifier generation, and local-storage access remain in dedicated modules.
 */
import {
  formatDateTime,
  getCurrentLocalDateTime,
  generateId,
} from "./js/utils.js";
import { loadTodos, saveTodos } from "./js/storage.js";

// DOM references are resolved once so event handlers can update the interface
// without repeatedly querying the document.
const form = document.querySelector(".todo-form");
const todoInput = document.querySelector("#todo");
const dateTimeInput = document.querySelector("#todo-date-time");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");
const allItemsToggle = document.querySelector("#all-items");
const deleteAllButton = document.querySelector("#delete-all");
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");
const allNavigationLinks = document.querySelectorAll(".nav-links a");
const navigationLinks = document.querySelectorAll('a[href^="#"]');
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const todoContainer = document.querySelector(".todo-container");
const currentYear = document.querySelector("#current-year");
const scrollTopButton = document.querySelector("#scroll-top");

currentYear.textContent = new Date().getFullYear();

/**
 * Reveals the return control only after the user has moved away from the
 * navbar, keeping the initial viewport free of unnecessary controls.
 */
function updateScrollTopButton() {
  scrollTopButton.hidden = window.scrollY < 240;
}

window.addEventListener("scroll", updateScrollTopButton, { passive: true });
updateScrollTopButton();

/** Return the document to the navbar when the floating control is activated. */
scrollTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/**
 * Scrolls an in-page target below the sticky navbar instead of hiding it
 * underneath the glass navigation. The spacing constant keeps the card
 * comfortably visible on both desktop and mobile viewports.
 */
function scrollToNavigationTarget(target) {
  const navbarHeight = navbar.getBoundingClientRect().height;
  const breathingRoom = 24;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const scrollTop = Math.max(0, targetTop - navbarHeight - breathingRoom);

  window.scrollTo({ top: scrollTop, behavior: "smooth" });
}

/**
 * Smoothly moves between in-page sections and closes the mobile menu afterward.
 * External links, such as Contact us, retain their browser-default behavior.
 */
navigationLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target =
      targetId === "#home" ? todoContainer : document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    scrollToNavigationTarget(target);
    window.history.replaceState(null, "", targetId);
    closeMobileMenu();
  });
});

/**
 * Closes the mobile navigation and synchronizes its accessibility state.
 * Keeping this in one helper prevents visual and ARIA state from drifting apart.
 */
function closeMobileMenu() {
  navbar.classList.remove("is-menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

// External navigation links still close the mobile menu before the browser
// follows their default action.
allNavigationLinks.forEach((link) => {
  if (link.matches('[href^="#"]')) return;
  link.addEventListener("click", closeMobileMenu);
});

/**
 * Toggles the mobile menu and exposes the current state to assistive technology.
 */
menuToggle.addEventListener("click", () => {
  const isOpen = navbar.classList.toggle("is-menu-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    `${isOpen ? "Close" : "Open"} navigation menu`,
  );
});

// Escape and outside clicks provide predictable dismissal paths for the menu.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMobileMenu();
});

document.addEventListener("click", (event) => {
  if (!navbar.contains(event.target)) closeMobileMenu();
});

/**
 * Provides immediate confirmation for contact submissions while the app has
 * no server endpoint. The form is reset only after browser validation passes.
 */
contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactStatus.textContent = "Thanks. Your message is ready to be reviewed.";
  contactForm.reset();
});

/**
 * @typedef {Object} Todo
 * @property {string} id Stable identifier used for updates and deletion.
 * @property {string} memo User-entered task text.
 * @property {string} dateTime Local datetime associated with the task.
 * @property {boolean} completed Whether the task is marked complete.
 */

/**
 * In-memory application state. The same array is persisted after every state
 * mutation so the rendered list and local storage remain synchronized.
 * @type {Todo[]}
 */
let todos = loadTodos();

/**
 * Synchronizes list summary controls with the current todo state.
 *
 * This includes the visible count, empty-state message, master completion
 * checkbox, and guarded Delete all action.
 */
function updateMemoCount() {
  todoCount.textContent = todos.length;
  emptyState.hidden = todos.length > 0;
  allItemsToggle.disabled = todos.length === 0;
  allItemsToggle.checked =
    todos.length > 0 && todos.every((todo) => todo.completed);
  deleteAllButton.disabled = todos.length === 0 || !allItemsToggle.checked;
}

/**
 * Applies one completion state to every todo and its rendered controls.
 * @param {boolean} completed Whether every task should be complete.
 */
function setAllTodosCompleted(completed) {
  todos.forEach((todo) => {
    todo.completed = completed;
  });

  todoList.querySelectorAll(".todo-row").forEach((row, index) => {
    const todoCard = row.querySelector(".todo-item");
    const completeToggle = row.querySelector(".todo-checkbox");
    const editButton = row.querySelector(".edit-todo");
    const todo = todos[index];

    completeToggle.checked = completed;
    todoCard.classList.toggle("is-complete", completed);
    editButton.disabled = completed;
    completeToggle.setAttribute("aria-label", `Mark ${todo.memo} completed`);
  });

  saveTodos(todos);
  updateMemoCount();
}

/** Apply the master checkbox selection to the complete todo collection. */
allItemsToggle.addEventListener("change", () => {
  setAllTodosCompleted(allItemsToggle.checked);
});

/**
 * Removes every task after the user has explicitly enabled the master control.
 * The guard is intentional because disabled controls should not be the only
 * protection against an accidental destructive action.
 */
deleteAllButton.addEventListener("click", () => {
  if (!allItemsToggle.checked) return;

  todos = [];
  todoList.replaceChildren();
  saveTodos(todos);
  updateMemoCount();
});

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

/**
 * Renders one todo and wires its completion, edit, and delete interactions.
 *
 * Each todo owns its row-level controls, while the outer state array remains
 * the source of truth for persistence and collection-level actions.
 * @param {Todo} todo Todo data to render.
 * @returns {void}
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
   * Commits the temporary edit field back to the todo model and row UI.
   * Empty edits are rejected so a task cannot be saved without a label.
   */
  function saveEdit() {
    const updatedMemo = editInput.value.trim();
    if (!updatedMemo) {
      editInput.focus();
      return;
    }
    todo.memo = updatedMemo;
    todo.dateTime = getCurrentLocalDateTime();
    itemText.textContent = todo.memo;
    itemDetails.textContent = formatDateTime(todo.dateTime);
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

  /** Keep the row appearance, edit availability, and storage in sync. */
  completeToggle.addEventListener("change", () => {
    todo.completed = completeToggle.checked;
    todoCard.classList.toggle("is-complete", todo.completed);
    editButton.disabled = todo.completed;
    saveTodos(todos);
    updateMemoCount();
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
    // Filter out the deleted item from state before removing its row.
    todos = todos.filter((savedTodo) => savedTodo.id !== todo.id);
    item.remove();
    updateMemoCount();
    saveTodos(todos);
  });

  todoCard.append(completeToggle, itemContent, editButton);
  item.append(todoCard, deleteButton);
  todoList.append(item);
}

/** Submit a new task when Enter is pressed in the memo field. */
todoInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.isComposing) {
    event.preventDefault();
    form.requestSubmit();
  }
});

/**
 * Validates, creates, renders, and persists a new todo from the entry form.
 */
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const memo = todoInput.value.trim();
  if (!memo || !dateTimeInput.value) {
    todoInput.focus();
    return;
  }

  const todo = {
    id: generateId(),
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

/** Render persisted tasks and initialize all derived controls on startup. */
todos.forEach(renderTodo);
updateMemoCount();
