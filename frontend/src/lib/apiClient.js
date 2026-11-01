const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// for storing promise of refresh request
let refreshPromise = null;

// Refresh access & refresh tokens using the HTTP-only refresh token cookie.
async function refreshSession() {
  const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    credentials: "include",
  });

  const result = await response.json().catch(() => null);

  /* Fetch API 401, 404 aur 500 jaise HTTP errors par automatically Promise reject nahi karti */
  if (!response.ok) {
    throw new Error(result?.message || "Session expired. Please login again.");
  }

  return result;
}

export async function apiRequest(endpoint, options = {}) {
  const requestOptions = {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
    },
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  // Do not refresh recursively if refresh endpoint itself fails.
  // It is the single-flight request pattern
  if (
    response.status === 401 &&
    endpoint !== "/auth/refresh-token" &&
    endpoint !== "/auth/login" &&
    endpoint !== "/auth/register"
  ) {
    try {
      // Prevent multiple simultaneous refresh requests.
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }

      // only request can execute at a time
      await refreshPromise;

      // Retry original request once.
      response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);
    } catch (error) {
      throw new Error(error.message || "Session expired. Please login again.");
    }
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(result?.message || "Something went wrong.");

    error.code = result?.code;
    error.status = response.status;

    throw error;
  }

  return result;
}
