const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// User registeration
export async function registerUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    /**
     * This (JSON) is a built-in library(object) in the language
     * It contains static utility methods to handle data conversion.
     * .stringify() : This is a synchronous method
     * It immediately takes a live JavaScript object/array (payload)
     * and converts it into a flat, raw text string so it can be sent over the internet.
     */
    body: JSON.stringify(payload),
  });

  /**
   * await response.json()
   * This (json) is a built-in tool(method) attached to the network response
   * The response object: When you make a network request (using fetch),
   * the server doesn't send the whole file instantly;
   * it arrives as a stream of raw bytes.
   * The response variable holds a reference to this ongoing stream.
   */

  /**
   * The .json() method: This is a built-in method belonging to the Fetch API response object.
   * It does two jobs behind the scenes:
   * It waits for the raw data stream from the network to completely finish downloading.
   * It automatically takes that downloaded text string and parses it back into a usable JavaScript object.
   */
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Registration failed. Please try again.",
    );
  }

  return result;
}

//email verification
export async function verifyEmail(token) {
  const response = await fetch(
    `${API_BASE_URL}/auth/verify-email/${encodeURIComponent(token)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  // Parse(convert) response body(server response) into JSON object
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message || "Email verification failed. Please try again.",
    );
  }

  return result;
}

//User login

export async function loginUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(
      result?.message || "Login failed. Please try again.",
    );

    error.code = result?.code;

    throw error;
  }

  return result;
}

// Re-send the email for verifiation
export async function resendVerificationEmail(email) {
  const response = await fetch(`${API_BASE_URL}/auth/resend-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
        "Failed to resend verification email. Please try again.",
    );
  }

  return result;
}
