import { API_BASE_URL } from "./config.js";

// Stores the currently running refresh request.
let refreshPromise = null;

// Custom event used to notify AuthContext about session expiration.
const SESSION_EXPIRED_EVENT = "auth:session-expired";

// Refresh the session using the HTTP-only refresh token cookie.
async function refreshSession() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      result?.message || "Session expired. Please login again.",
    );

    error.code = result?.code;
    error.status = response.status;

    throw error;
  }

  return result;
}

// Notify AuthContext when the session can no longer be refreshed.
function notifySessionExpired() {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

// Centralized API request function.
export async function apiRequest(endpoint, options = {}) {
  const requestOptions = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  };

  const request = new Request(`${API_BASE_URL}${endpoint}`, requestOptions);

  // Send the original API request.
  let response = await fetch(request.clone());

  // Check whether this request is eligible for token refresh.
  const shouldRefresh =
    response.status === 401 &&
    endpoint !== "/auth/refresh-token" &&
    endpoint !== "/auth/login" &&
    endpoint !== "/auth/register";

  if (shouldRefresh) {
    const errorResult = await response
      .clone()
      .json()
      .catch(() => null);

    // Refresh only when the access token has expired.
    if (errorResult?.code === "ACCESS_TOKEN_EXPIRED") {
      try {
        // Reuse an existing refresh request if one is already running.
        if (!refreshPromise) {
          refreshPromise = refreshSession().finally(() => {
            refreshPromise = null;
          });
        }

        // Wait for the refresh request.
        await refreshPromise;

        // Retry the original request once.
        response = await fetch(request.clone());

        if (response.status === 401) {
          const retryError = await response
            .clone()
            .json()
            .catch(() => null);

          if (
            retryError?.code === "ACCESS_TOKEN_EXPIRED" ||
            retryError?.code === "INVALID_ACCESS_TOKEN"
          ) {
            notifySessionExpired();
          }
        }
      } catch (error) {
        // Only clear authentication for confirmed refresh-token failures.
        const terminalRefreshErrors = [
          "REFRESH_TOKEN_EXPIRED",
          "INVALID_REFRESH_TOKEN",
          "REFRESH_TOKEN_MISSING",
        ];

        if (terminalRefreshErrors.includes(error.code)) {
          notifySessionExpired();
        }

        throw error;
      }
    }
  }

  // Parse the final API response.
  const result = await response.json().catch(() => null);

  // Handle unsuccessful responses.
  if (!response.ok) {
    const error = new Error(result?.message || "Something went wrong.");

    error.code = result?.code;
    error.status = response.status;

    throw error;
  }

  return result;
}
