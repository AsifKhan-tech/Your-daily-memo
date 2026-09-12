const STORAGE_KEY = "daily-memo-todos";

/**
 * Retrieves and validates the todo list from local storage.
 * @returns {Array} An array of valid todo objects.
 */
export function loadTodos() {
  try {
    const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(storedTodos)) return [];
    return storedTodos; // You can keep your type-checking filter here!
  } catch {
    return [];
  }
}

/**
 * Persists the current state to local storage.
 * @param {Array} todos - The array of todos to save.
 */
export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    console.warn("Local storage is unavailable.");
  }
}
