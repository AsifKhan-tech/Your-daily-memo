/**
 * Shared date and identifier helpers used by the todo UI.
 * Kept out of main.js so rendering code does not mix with formatting details.
 */

/**
 * Turns a stored datetime into a locale-aware string for the list row
 * (for example "Oct 26, 2026, 9:05 PM" in the user's locale).
 * @param {string} dateTime ISO or datetime-local string from the todo record.
 * @returns {string} Human-readable date and time.
 */
export function formatDateTime(dateTime) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateTime));
}

/**
 * Builds a value suitable for <input type="datetime-local"> using the user's
 * local clock. Used when an edited memo should bump its timestamp to "now".
 * @returns {string} YYYY-MM-DDTHH:mm
 */
export function getCurrentLocalDateTime() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/**
 * Cheap unique id for a todo. Combines a timestamp with random hex so two
 * tasks created in the same millisecond still get different keys.
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
