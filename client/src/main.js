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

// Elements from the header component.
const siteHeader = document.querySelector(".site-header");
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const themeToggle = document.querySelector("#theme-toggle");
const allNavigationLinks = document.querySelectorAll(".nav-links a");

// In-page links are shared by the header and footer navigation.
const navigationLinks = document.querySelectorAll('a[href^="#"]');

// Elements from the registration component.
const loginButton = document.querySelector(".auth-btn-login");
const registerButton = document.querySelector(".auth-btn-register");
const registerDialog = document.querySelector("#register-dialog");
const authDialogTitle = document.querySelector("#register-title");
const authDialogEyebrow = document.querySelector("#auth-dialog-eyebrow");
const registerPanel = document.querySelector("#register-panel");
const loginPanel = document.querySelector("#login-panel");

//select register and login form
const registerForm = document.querySelector(".register-form");
const loginForm = document.querySelector(".login-form");

// Keep the registration controls grouped so submission reads every value consistently.
const registerFields = {
  /**
   * scoped selection, browser search in the specific element
   * selecting elements using attribute selector
   */
  name: registerForm.querySelector('[name="name"]'),
  email: registerForm.querySelector('[name="email"]'),
  password: registerForm.querySelector('[name="password"]'),
  role: registerForm.querySelector('[name="role"]'),
};

// toast message's references
const toast = document.getElementById("toast-message");
const toastCloseBtn = document.getElementById("toast-close");
const toastIcon = document.querySelector(".toast-icon");
const toastText = document.querySelector("#toast-text");
let toastTimeout; // reference to clear the timer

//This element is for showing the error message
const registerStatus = registerForm.querySelector("#register-status");

// Select all buttons that have a attribute named data-auth-mode
const authModeButtons = document.querySelectorAll("[data-auth-mode]");

// Select all buttons that have a attribute named data-password-target
const passwordToggleButtons = document.querySelectorAll(
  "[data-password-target]",
);

// Elements from the todo entry component.
const todoContainer = document.querySelector(".todo-container");
const form = document.querySelector(".todo-form");
const todoInput = document.querySelector("#todo");
const dateTimeInput = document.querySelector("#todo-date-time");

// Elements from the todo list component.
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");
const allItemsToggle = document.querySelector("#all-items");
const deleteAllButton = document.querySelector("#delete-all");

// Elements from the contact component.
const contactForm = document.querySelector("#contact-form");
const contactStatus = document.querySelector("#contact-status");

// Elements from the footer component.
const siteFooter = document.querySelector(".site-footer");
const currentYear = document.querySelector("#current-year");

// Element from the floating scroll control.
const scrollTopButton = document.querySelector("#scroll-top");

// Separate from the todos key so theme choice survives even if the list is cleared.
const THEME_STORAGE_KEY = "daily-memo-theme";

/**
 * Applies a theme, updates the toggle to describe the next available mode,
 * and persists the user's explicit choice for future visits.
 * @param {"dark" | "light"} theme Theme to activate.
 */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeToggle.setAttribute(
    "title",
    `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode`,
  );
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme remains active for the current page session.
  }
}

/** Restore the saved theme, defaulting to dark for first-time visitors. */
function initializeTheme() {
  let savedTheme;
  try {
    savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    savedTheme = null;
  }
  setTheme(savedTheme === "light" ? "light" : "dark");
}

initializeTheme();

// Flip between dark and light on each click.
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

// Keep the footer copyright current without editing HTML every January.
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
  // Measure the complete sticky header, including its vertical padding, so
  // the memo eyebrow and heading remain below the visible navigation surface.
  const headerHeight = siteHeader.getBoundingClientRect().height;
  const breathingRoom = 32;
  const targetTop = target.getBoundingClientRect().top + window.scrollY;
  const scrollTop = Math.max(0, targetTop - headerHeight - breathingRoom);

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
      targetId === "#home" || targetId === "#todos"
        ? todoContainer
        : targetId === "#contact"
          ? siteFooter
          : document.querySelector(targetId);
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

// Add new code: Switch the shared dialog between auth panels and move focus
// into the selected form so keyboard users can continue immediately.

function showAuthMode(mode) {
  const isLogin = mode === "login";
  /**
   * 2nd argument ensures if it's false, class is removed otherwise it's added
   */
  loginPanel.classList.toggle("is-active", isLogin);
  registerPanel.classList.toggle("is-active", !isLogin);

  /**
   * if isLogin is true, inert will true it will disable that element
   */
  registerPanel.inert = isLogin;
  loginPanel.inert = !isLogin;

  authDialogTitle.textContent = isLogin ? "Login" : "Register";
  authDialogEyebrow.textContent = isLogin
    ? "Welcome back"
    : "Create your account";

  if (!registerDialog.open) registerDialog.showModal();
  (isLogin
    ? document.querySelector("#login-email")
    : document.querySelector("#register-name")
  ).focus();

  //update the url
  // window.history.pushState(null, "", "/" + mode);
}

loginButton.addEventListener("click", () => showAuthMode("login"));
registerButton.addEventListener("click", () => showAuthMode("register"));

//update url when close the form
// registerDialog.addEventListener("close", () => {
//   window.history.pushState(null, "", "/");
// });

/**
 * Extract the value of the tag that is given a custom attribute
 * HTML tag: <button data-auth-mode = "register">
 * Use dataset property of this tag and write it camelCase and remove data word of the HTML
 * button.dataset.authMode
 */
authModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showAuthMode(button.dataset.authMode);
  });
});

// Add new code: Toggle each password field independently and expose its state
// to assistive technology through the button's label and pressed state.
passwordToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    /**
     * Attribute on button is: data-password-target = "login password/register password"
     * passwordTarget = "login password/register password"
     * document.getElementById("login password/register password")
     * It will select password input field
     */
    const passwordInput = document.getElementById(
      button.dataset.passwordTarget,
    );
    const isVisible = passwordInput.type === "text";
    passwordInput.type = isVisible ? "password" : "text";
    button.setAttribute("aria-pressed", String(!isVisible));
    button.setAttribute(
      "aria-label",
      `${isVisible ? "Show" : "Hide"} password`,
    );
  });
});

// Optional: Manual close button function
toastCloseBtn.addEventListener("click", () => {
  toast.classList.add("hidden");
  clearTimeout(toastTimeout);
});

// 2. Reusable Toast Function (for Success and Error handling)
function showToast(message, isSuccess) {
  // Clear previous timer
  clearTimeout(toastTimeout);

  // Set the text message
  toastText.textContent = message;

  // Check state and apply colors & icons
  if (isSuccess) {
    toast.classList.remove("error");
    // Success Icon (Green tick)
    toastIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
  } else {
    toast.classList.add("error");
    // Error Icon (Cross)
    toastIcon.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  }

  // Show the toast
  toast.classList.remove("hidden");

  // Hide after 3 seconds
  toastTimeout = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2000);
}

// 3. Verification API Call on Page Load
window.addEventListener("DOMContentLoaded", async () => {
  const currentPath = window.location.pathname;

  if (currentPath.startsWith("/verify-email/")) {
    const urlParts = currentPath.split("/");
    const token = urlParts[urlParts.length - 1];

    if (token) {
      const url = `http://localhost:4000/api/v1/auth/verify-email/${token}`;
      try {
        const response = await fetch(url, { method: "GET" });
        const data = await response.json(); // read the message from Backend

        if (response.ok) {
          // Success: Show Green Toast
          showToast("Email verified successfully", true);

          // Clean the URL and open login modal
          window.history.replaceState(null, "", "/");
          // setTimeout(() => showAuthMode("login"), 1000);
        } else {
          // Error: Show Red Toast
          showToast(data.message || "Email verification failed", false);
          window.history.replaceState(null, "", "/");
        }
      } catch (error) {
        // Network Crash: Show Red Toast
        showToast("Network error. Unable to connect.", false);
      }
    }
  }
});

// Apply the backend registration rules to the grouped field values before proceeding.
registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Match Joi transformations: trim the name and lowercase the email, but preserve password whitespace.
  const registerValues = {
    name: registerFields.name.value.trim(),
    email: registerFields.email.value.toLowerCase(),
    password: registerFields.password.value,
    role: registerFields.role.value || "user",
  };

  //Assign clean data to the input fields so that
  //if an error occurrs, user will this clean data
  registerFields.name.value = registerValues.name;
  registerFields.email.value = registerValues.email;

  // Match the backend's required fields, length limits, email format, and allowed optional roles.
  const errors = [];
  if (!registerValues.name) {
    errors.push({ field: "name", message: "Name is required." });
  } else if (
    registerValues.name.length < 2 ||
    registerValues.name.length > 50
  ) {
    errors.push({
      field: "name",
      message: "Name must be between 2 and 50 characters.",
    });
  }

  if (!registerValues.email) {
    errors.push({ field: "email", message: "Email is required." });
  } else if (
    registerValues.email.length < 3 ||
    registerValues.email.length > 254 ||
    /**
     * This validity.typeMismatch is the part of HTML5 validation API
     * Bcz input type = "email" in HTML structure,
     *  browser checks itself that the given text is in email(@) format or not
     * registerFields.email: selects the node(input) reference not its value
     * Bcz browser's built-in feature (HTML5 validation API) doesn't work on string
     * while it works on physcial DOM node and .validity property exist with it & returns true/false
     */
    registerFields.email.validity.typeMismatch
  ) {
    errors.push({
      field: "email",
      message: "Enter a valid email address (maximum 254 characters).",
    });
  }

  if (!registerValues.password) {
    errors.push({ field: "password", message: "Password is required." });
  } else if (
    registerValues.password.length < 8 ||
    registerValues.password.length > 128
  ) {
    errors.push({
      field: "password",
      message: "Password must be between 8 and 128 characters.",
    });
  }

  if (!["student", "teacher", "user"].includes(registerValues.role)) {
    errors.push({ field: "role", message: "Select a valid role." });
  }

  // Mark invalid fields and announce all validation errors accessibly.

  Object.entries(registerFields).forEach(([fieldName, field]) => {
    //                                    name        input field
    field.setAttribute(
      "aria-invalid",

      //some method checks there is any error in errors that matches fieldname
      String(errors.some((error) => error.field === fieldName)),
    );
  });
  registerStatus.textContent = errors.map((error) => error.message).join(" ");
  registerStatus.hidden = errors.length === 0;

  /**
   * using bracket notation
   * registerFields[error[0].field].focus() = registerFields[{field:"name", message:"Name is required"}]
   * registerFields["name"] = select the name element(input)
   * .focus() method will do cursor focus on the selected field
   *
   */
  if (errors.length > 0) registerFields[errors[0].field].focus();

  //clear the form when user submit the form
  registerForm.reset();

  try {
    const url = "http://localhost:4000/api/v1/auth/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerValues),
    });

    console.log("Server response: ", response);

    if (response.ok) {
      if (registerDialog.open) {
        registerDialog.close();
      }

      //show toast message
      toast.classList.remove("hidden");

      toastTimeout = setTimeout(() => {
        toast.classList.add("hidden");
        // window.location.hash = "#/";
      }, 2000);

      const responseData = await response.json();
      console.log("Registration successfull: ", responseData);
    } else {
      registerStatus.textContent = "Registration failed. Please check details";
      registerStatus.hidden = false;
      console.error("Backend error. Registration failed");
    }
  } catch (error) {
    registerStatus.textContent = "Network error. Unable to connect";
    registerStatus.hidden = false;
    console.error("Network problem", error);
  }
});

// Keep login presentation-only until its authentication endpoint is wired in.
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
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
 * Orders tasks from the latest scheduled datetime to the earliest.
 * Invalid or missing dates are placed after valid task dates.
 */
function sortTodosByNewest() {
  todos.sort((firstTodo, secondTodo) => {
    const firstTime = Date.parse(firstTodo.dateTime);
    const secondTime = Date.parse(secondTodo.dateTime);
    const firstIsValid = Number.isFinite(firstTime);
    const secondIsValid = Number.isFinite(secondTime);

    if (!firstIsValid || !secondIsValid) {
      return Number(secondIsValid) - Number(firstIsValid);
    }

    return secondTime - firstTime;
  });
}

/** Rebuilds the visible list from the current, already-sorted state. */
function renderAllTodos() {
  todoList.replaceChildren();
  todos.forEach(renderTodo);
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

  // Per-row edit session: the Delete button becomes Save until the field is committed.
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
    saveTodos(todos);
    sortTodosByNewest();
    renderAllTodos();
  }

  /** Synchronize completion state, row styling, edit availability, and storage. */
  completeToggle.addEventListener("change", () => {
    todo.completed = completeToggle.checked;
    todoCard.classList.toggle("is-complete", todo.completed);
    editButton.disabled = todo.completed;
    saveTodos(todos);
    updateMemoCount();
  });

  // Swap the memo text for an input; Enter or Save commits via saveEdit().
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
    // Remove the record from state before removing its corresponding row.
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
  sortTodosByNewest();
  renderAllTodos();
  updateMemoCount();
  saveTodos(todos);

  form.reset();
  todoInput.focus();
});

// First paint: load from storage already happened above; sort, draw, then sync counts.
sortTodosByNewest();
renderAllTodos();
updateMemoCount();
