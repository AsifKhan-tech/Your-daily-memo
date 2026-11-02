import { useRef, useState } from "react";
import { Link } from "react-router";

import { forgotPassword } from "../services/authService.js";
import { validateForgotPasswordDto } from "../dto/forgotPassword.dto.js";

import Toast from "../../../components/ui/Toast.jsx";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const submissionStarted = useRef(false);

  function handleEmailChange(event) {
    setEmail(event.target.value);

    setErrors((previous) => ({
      ...previous,
      email: "",
    }));

    setToast(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submissionStarted.current) return;

    const validation = validateForgotPasswordDto({ email });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    submissionStarted.current = true;
    setIsSubmitting(true);
    setErrors({});
    setToast(null);

    try {
      const response = await forgotPassword(validation.data.email);

      setToast({
        type: "success",
        message:
          response.message ||
          "If an account exists with this email, you will receive a password reset link.",
      });
    } catch (error) {
      setToast({
        type: "error",
        message:
          error.message || "Unable to process your request. Please try again.",
      });
    } finally {
      submissionStarted.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="todo-container auth-container forgot-password-container">
        <div className="register-heading">
          <div>
            <p className="eyebrow">Account Recovery</p>
            <h1>Forgot Password?</h1>
          </div>
        </div>

        <p className="forgot-password-description">
          Enter the email address associated with your account. If an account
          exists, we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="forgot-password-email">
              Email Address <span className="required-indicator">*</span>
            </label>

            <input
              type="email"
              id="forgot-password-email"
              className="todo"
              placeholder="jane.doe@example.com"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "forgot-password-email-error" : undefined
              }
              required
            />

            {errors.email && (
              <small className="field-error" id="forgot-password-email-error">
                {errors.email}
              </small>
            )}
          </div>

          <button type="submit" className="add-todo" disabled={isSubmitting}>
            {isSubmitting ? "Sending reset link..." : "Send Reset Link"}
          </button>
        </form>

        <p className="register-login-prompt">
          Remember your password? <Link to="/login">Back to Login</Link>
        </p>
      </section>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default ForgotPasswordForm;
