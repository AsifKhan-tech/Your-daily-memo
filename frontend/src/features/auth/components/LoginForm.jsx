import { useState } from "react";
import { Link, useNavigate } from "react-router";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setMessage(
      "Login form ready. Backend authentication is not connected yet.",
    );
  }

  return (
    <section className="todo-container auth-container login-container">
      <div className="register-heading">
        <div>
          <p className="eyebrow">Welcome Back</p>
          <h1>Login</h1>
        </div>

        <button
          type="button"
          className="register-close"
          aria-label="Close login form"
          onClick={() => navigate("/")}
        >
          &times;
        </button>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="login-email">
            Email <span className="required-indicator">*</span>
          </label>

          <input
            type="email"
            id="login-email"
            className="todo"
            placeholder="jane.doe@example.com"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">
            Password <span className="required-indicator">*</span>
          </label>

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              id="login-password"
              className="todo"
              placeholder="********"
              autoComplete="current-password"
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
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a15.8 15.8 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.7 10.7 0 0 0 4-.8" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button className="add-todo" type="submit">
          Login
        </button>

        {message && (
          <p className="contact-status" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </form>

      <p className="register-login-prompt">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}

export default LoginForm;
