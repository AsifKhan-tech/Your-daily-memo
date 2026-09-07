const form = document.querySelector(".todo-form");
const todoInput = document.querySelector("#todo");
const dateTimeInput = document.querySelector("#todo-date-time");
const todoList = document.querySelector("#todo-list");
const todoCount = document.querySelector("#todo-count");
const emptyState = document.querySelector("#empty-state");

const STORAGE_KEY = "daily-memo-todos";
let todos = loadTodos();

function loadTodos() {
  try {
    const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(storedTodos)) return [];

    return storedTodos.filter(
      (todo) =>
        typeof todo.id === "string" &&
        typeof todo.memo === "string" &&
        typeof todo.dateTime === "string",
    );
  } catch {
    return [];
  }
}

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // The app remains usable if browser storage is unavailable.
  }
}

function updateMemoCount() {
  todoCount.textContent = todos.length;
  emptyState.hidden = todos.length > 0;
}

function formatDateTime(dateTime) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateTime));
}

function getCurrentLocalDateTime() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

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
    saveTodos();
  }

  completeToggle.addEventListener("change", () => {
    todo.completed = completeToggle.checked;
    todoCard.classList.toggle("is-complete", todo.completed);
    editButton.disabled = todo.completed;
    saveTodos();
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

    todos = todos.filter((savedTodo) => savedTodo.id !== todo.id);
    item.remove();
    updateMemoCount();
    saveTodos();
  });

  todoCard.append(completeToggle, itemContent, editButton);
  item.append(todoCard, deleteButton);
  todoList.append(item);
}

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
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    memo,
    dateTime: dateTimeInput.value,
    completed: false,
  };

  todos.push(todo);
  renderTodo(todo);
  updateMemoCount();
  saveTodos();
  form.reset();
  todoInput.focus();
});

todos.forEach(renderTodo);
updateMemoCount();
