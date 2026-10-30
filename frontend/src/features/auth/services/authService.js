const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export async function registerUser(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // Response ko JSON mein convert karne ki koshish
  const result = await response.json().catch(() => null);

  // HTTP error handle karo
  if (!response.ok) {
    throw new Error(
      result?.message || "Registration failed. Please try again.",
    );
  }

  return result;
}
