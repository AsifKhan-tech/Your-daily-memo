/** Local-storage key used to persist the user's todo collection. */
const STORAGE_KEY = "daily-memo-todos";

/**
 * Retrieves the persisted todo collection.
 *
 * Invalid JSON, unavailable storage, and non-array values are treated as an
 * empty collection so storage failures do not prevent the app from loading.
 * @returns {Array<Object>} The stored todo records, or an empty array.
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
 * Persists the current todo collection to local storage.
 *
 * Storage is intentionally best-effort: the UI remains usable when browser
 * privacy settings or storage quotas prevent persistence.
 * @param {Array<Object>} todos The todo records to serialize.
 */
export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    console.warn("Local storage is unavailable.");
  }
}
