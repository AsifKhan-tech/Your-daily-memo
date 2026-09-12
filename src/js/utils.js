/**
 * Formats an ISO datetime string into a localized format.
 * @param {string} dateTime - The ISO string representation.
 * @returns {string} The formatted date and time string.
 */
export function formatDateTime(dateTime) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateTime));
}

/**
 * Generates a local datetime string for HTML inputs.
 * @returns {string} Date formatted as YYYY-MM-DDTHH:mm.
 */
export function getCurrentLocalDateTime() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/**
 * Generates a unique identifier for new todos.
 * @returns {string} A unique ID string.
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
