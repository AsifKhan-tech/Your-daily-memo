import { apiRequest } from "../../../lib/apiClient.js";

export async function submitContact(payload) {
  return apiRequest("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
