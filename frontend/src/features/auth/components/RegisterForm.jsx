import { useState } from "react";
import { Link } from "react-router";

function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setMessage(
      "Registration form ready. Backend registration is not connected yet.",
    );
  }

  return (
    <section className="todo-container auth-container">
      <p className="eyebrow">Get started</p>
      <h1>Create your account</h1>
      <p className="intro">Join Daily Memo and organize your day.</p>

      <form className="todo-form auth-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="register-name">Full name</label>
          <input
            className="todo"
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            className="todo"
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            className="todo"
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <label htmlFor="confirm-password">Confirm password</label>
          <input
            className="todo"
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Enter your password again"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        <label className="auth-password-toggle">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          Show passwords
        </label>

        <button className="add-todo" type="submit">
          Register
        </button>

        <p className="contact-status" role="status" aria-live="polite">
          {message}
        </p>
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login here</Link>
      </p>

      <p className="auth-switch">
        <Link to="/">Back to Daily Memo</Link>
      </p>
    </section>
  );
}

export default RegisterForm;
