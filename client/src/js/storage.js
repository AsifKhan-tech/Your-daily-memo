/**
 * Persist the todo list in the browser.
 * The UI still works if localStorage is blocked; saves then fail silently.
 */

/** Key under which the JSON array of todos is stored. */
const STORAGE_KEY = "daily-memo-todos";

/**
 * Read todos from localStorage.
 * Missing data, invalid JSON, or a non-array value all become [].
 * @returns {Array<Object>} Stored records, or an empty array.
 */
export function loadTodos() {
  try {
    const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(storedTodos)) return [];
    return storedTodos;
  } catch {
    return [];
  }
}

/**
 * Write the current in-memory list back to localStorage.
 * Quota or privacy errors are logged; the on-screen list is left intact.
 * @param {Array<Object>} todos Records to serialize.
 */
export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    console.warn("Local storage is unavailable.");
  }
}
