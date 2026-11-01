const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api/v1";

// Stores the currently running refresh request.
let refreshPromise = null;

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
    // Read a clone so the original response body remains available.
    const errorResult = await response
      .clone()
      .json()
      .catch(() => null);

    // Refresh only when the backend specifically reports an expired token.
    if (errorResult?.code === "ACCESS_TOKEN_EXPIRED") {
      try {
        // Reuse an existing refresh request if one is already running.
        if (!refreshPromise) {
          refreshPromise = refreshSession().finally(() => {
            refreshPromise = null;
          });
        }

        // Wait until the refresh request completes.
        await refreshPromise;

        // Retry the original request once with the new cookies.
        response = await fetch(request.clone());
      } catch (error) {
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
