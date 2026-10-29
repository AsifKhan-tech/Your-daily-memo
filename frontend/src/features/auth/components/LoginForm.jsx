import { useState } from "react";
import { Link } from "react-router";

function LoginForm() {
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
    <section className="todo-container auth-container">
      <p className="eyebrow">Welcome back</p>
      <h1>Login to your account</h1>
      <p className="intro">Sign in to continue to Daily Memo.</p>

      <form className="todo-form auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="login-email">Email</label>
          <input
            className="todo"
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Password</label>
          <input
            className="todo"
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <label className="auth-password-toggle">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          Show password
        </label>

        <button className="add-todo" type="submit">
          Login
        </button>

        <p className="contact-status" role="status" aria-live="polite">
          {message}
        </p>
      </form>

      <p className="auth-switch">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>

      <p className="auth-switch">
        <Link to="/">Back to Daily Memo</Link>
      </p>
    </section>
  );
}

export default LoginForm;
