import { useState } from "react";
import { Link, useNavigate } from "react-router";

function RegisterForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      "Registration form ready. Backend registration is not connected yet.",
    );
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

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="input-group">
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
            onChange={(event) => setName(event.target.value)}
            required
          />

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
            onChange={(event) => setEmail(event.target.value)}
            required
          />

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
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
                // Eye with a slash: password is currently visible.
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 3l18 18" />
                  <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.5 0 9 7 9 7a14 14 0 0 1-3.1 3.8" />
                  <path d="M6.2 6.2C3.9 7.8 3 12 3 12s3.5 7 9 7a10 10 0 0 0 4-.8" />
                </svg>
              ) : (
                // Normal eye: password is hidden.
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          <label htmlFor="register-role">
            Role <span className="optional-indicator">(Optional)</span>
          </label>

          <div className="register-role-select">
            <select
              id="register-role"
              className="todo"
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="User">User</option>
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
        </div>

        <button className="add-todo" type="submit">
          Create account
        </button>

        {message && (
          <p className="contact-status" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </form>

      <p className="register-login-prompt">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

export default RegisterForm;
