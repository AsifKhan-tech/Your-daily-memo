- Implemented main JavaScript logic for managing todos, including adding, editing, and deleting tasks.

- Integrated local storage to persist todos across sessions.

- Created a responsive and accessible UI with HTML and CSS for the todo application.

- Added functionality to display the current date and time for each todo item.

- Included visual indicators for completed and editable states of todos.

### validation code

```js
// Step 1: Import Joi (assuming ES Modules setup)
import Joi from "joi";

// Step 2: Define the Validation Schema (Blueprint)
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be between 2 and 50 characters.",
    "string.max": "Name must be between 2 and 50 characters.",
  }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .lowercase()
    .min(3)
    .max(254)
    .required()
    .messages({
      "string.empty": "Email is required.",
      "string.email": "Enter a valid email address (maximum 254 characters).",
    }),
  password: Joi.string().min(8).max(128).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be between 8 and 128 characters.",
    "string.max": "Password must be between 8 and 128 characters.",
  }),
  role: Joi.string()
    .valid("student", "teacher", "user")
    .default("user")
    .messages({
      "any.only": "Select a valid role.",
    }),
});

// Step 3: The Form Submit Event Listener
registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // 1. Raw data extract karna
  const rawValues = {
    name: registerFields.name.value,
    email: registerFields.email.value,
    password: registerFields.password.value,
    role: registerFields.role.value || "user",
  };

  // 2. Joi se data validate karna
  const { error, value: cleanValues } = registerSchema.validate(rawValues, {
    abortEarly: false,
  });

  // 3. UI inputs ko clean data se update karna
  registerFields.name.value = cleanValues.name;
  registerFields.email.value = cleanValues.email;

  // 4. Purane ARIA states reset karna
  Object.values(registerFields).forEach((field) =>
    field.setAttribute("aria-invalid", "false"),
  );

  // 5. Error Handling logic
  if (error) {
    // Har error field par aria-invalid true set karna
    error.details.forEach((err) => {
      const fieldName = err.context.key;
      registerFields[fieldName].setAttribute("aria-invalid", "true");
    });

    // Saare messages nikal kar screen par dikhana
    const errorMessages = error.details.map((err) => err.message);
    registerStatus.textContent = errorMessages.join(" ");
    registerStatus.hidden = false;

    // Pehli galti wale input field par focus (cursor) le jana
    const firstErrorField = error.details[0].context.key;
    registerFields[firstErrorField].focus();
    return; // Execution yahin rok dena
  }

  // 6. Success State
  registerStatus.hidden = true;
  console.log("Validation passed! Ready to submit to Backend:", cleanValues);
});
```
