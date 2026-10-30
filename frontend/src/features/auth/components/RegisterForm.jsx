import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import { validateRegisterDto } from "../dto/register.dto";
import { registerUser } from "../services/authService";

function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

  // Prevent multiple registration requests.
  const submissionStarted = useRef(false);

  // Handle input changes and clear individual field errors.
  function handleFieldChange(field, value, setter) {
    setter(value);

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  }

  // Handle registration form submission.
  async function handleSubmit(event) {
    event.preventDefault();

    // Prevent duplicate submissions.
    if (submissionStarted.current) return;

    // Prepare form data.
    const formData = {
      name,
      email,
      password,
      role,
    };

    // Step 1: Validate form data.
    const validation = validateRegisterDto(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    submissionStarted.current = true;

    // Step 2: Save validated data before clearing inputs.
    const registrationData = validation.data;

    // Step 3: Immediately clear all input fields.
    setName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setShowPassword(false);
    setErrors({});

    try {
      // Step 4: Send registration request to backend.
      // Browser URL remains /register while waiting.
      const response = await registerUser(registrationData);

      // Step 5: Redirect to homepage after successful response.
      navigate("/", {
        replace: true,
        state: {
          registrationSuccess: true,
          message: "Confirm your email",
        },
      });
    } catch (error) {
      // Step 6: Redirect to homepage if registration fails.
      navigate("/", {
        replace: true,
        state: {
          registrationError: true,
          message: error.message || "Registration failed. Please try again.",
        },
      });
    } finally {
      // Allow another registration attempt if needed.
      submissionStarted.current = false;
    }
  }

  return (
    <section className="todo-container auth-container register-container">
      <div className="register-heading">
        <div>
          <p className="eyebrow">Create Your Account</p>
          <h1>Register</h1>
        </div>

        <button
          type="button"
          className="register-close"
          aria-label="Close registration form"
          onClick={() => navigate("/")}
        >
          &times;
        </button>
      </div>

      <form className="register-form" onSubmit={handleSubmit} noValidate>
        <div className="input-group">
          {/* Name */}
          <label htmlFor="register-name">
            Name <span className="required-indicator">*</span>
          </label>

          <input
            type="text"
            id="register-name"
            className="todo"
            placeholder="Jane Doe"
            autoComplete="name"
            value={name}
            onChange={(event) =>
              handleFieldChange("name", event.target.value, setName)
            }
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "register-name-error" : undefined}
            required
          />

          {errors.name && (
            <small className="field-error" id="register-name-error">
              {errors.name}
            </small>
          )}

          {/* Email */}
          <label htmlFor="register-email">
            Email <span className="required-indicator">*</span>
          </label>

          <input
            type="email"
            id="register-email"
            className="todo"
            placeholder="jane.doe@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) =>
              handleFieldChange("email", event.target.value, setEmail)
            }
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            required
          />

          {errors.email && (
            <small className="field-error" id="register-email-error">
              {errors.email}
            </small>
          )}

          {/* Password */}
          <label htmlFor="register-password">
            Password <span className="required-indicator">*</span>
          </label>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="register-password"
              className="todo"
              placeholder="********"
              autoComplete="new-password"
              value={password}
              onChange={(event) =>
                handleFieldChange("password", event.target.value, setPassword)
              }
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "register-password-error" : undefined
              }
              required
            />

            <button
              type="button"
              className="password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((previous) => !previous)}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a14 14 0 0 1-3.1 3.8" />
                  <path d="M6.2 6.2C3.9 8 3 12 3 12s3.5 7 9 7a10 10 0 0 0 4-.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {errors.password && (
            <small className="field-error" id="register-password-error">
              {errors.password}
            </small>
          )}

          {/* Role */}
          <label htmlFor="register-role">
            Role <span className="optional-indicator">(Optional)</span>
          </label>

          <div className="register-role-select">
            <select
              id="register-role"
              className="todo"
              value={role}
              onChange={(event) =>
                handleFieldChange("role", event.target.value, setRole)
              }
            >
              <option value="user">User</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
        </div>

        <button className="add-todo" type="submit">
          Create account
        </button>
      </form>

      <p className="register-login-prompt">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default RegisterForm;
