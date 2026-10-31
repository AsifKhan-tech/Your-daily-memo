import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

import { validateLoginDto } from "../dto/login.dto";
import { loginUser, resendVerificationEmail } from "../services/authService";

import Toast from "../../../components/ui/Toast";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const [toast, setToast] = useState(null);

  const submissionStarted = useRef(false);

  // Automatically hide toast after 5 seconds.
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast]);

  // Handle input changes and clear individual field errors.
  function handleFieldChange(field, value, setter) {
    setter(value);

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));

    // Hide resend option when the email changes.
    if (field === "email") {
      setRequiresVerification(false);
    }
  }

  // Handle login submission.
  async function handleSubmit(event) {
    event.preventDefault();

    if (submissionStarted.current) return;

    const formData = {
      email,
      password,
    };

    // Validate credentials using Joi.
    const validation = validateLoginDto(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    submissionStarted.current = true;

    setIsSubmitting(true);
    setErrors({});
    setToast(null);
    setRequiresVerification(false);

    try {
      const response = await loginUser(validation.data);

      // Redirect after successful login.
      navigate("/", {
        replace: true,
        state: {
          loginSuccess: true,
          message: response.message || "Login successful. Welcome back!",
        },
      });
    } catch (error) {
      const errorMessage = error.message || "Login failed. Please try again.";

      // Check the structured backend error code.
      const needsVerification = error.code === "EMAIL_NOT_VERIFIED";

      setRequiresVerification(needsVerification);

      setToast({
        type: "error",
        message: errorMessage,
      });
    } finally {
      submissionStarted.current = false;
      setIsSubmitting(false);
    }
  }

  // Resend email verification link.
  async function handleResendVerification() {
    if (isResending || !email.trim()) return;

    setIsResending(true);
    setToast(null);

    try {
      const response = await resendVerificationEmail(email.trim());

      setToast({
        type: "success",
        message: response.message || "Verification email sent successfully.",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Unable to resend verification email.",
      });
    } finally {
      setIsResending(false);
    }
  }

  return (
    <>
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

        <form className="login-form" onSubmit={handleSubmit} noValidate>
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
              onChange={(event) =>
                handleFieldChange("email", event.target.value, setEmail)
              }
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              required
            />

            {errors.email && (
              <small className="field-error" id="login-email-error">
                {errors.email}
              </small>
            )}

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
                onChange={(event) =>
                  handleFieldChange("password", event.target.value, setPassword)
                }
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
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

            {errors.password && (
              <small className="field-error" id="login-password-error">
                {errors.password}
              </small>
            )}
          </div>

          {requiresVerification && (
            <div className="resend-verification-wrapper">
              <p className="resend-verification-message">
                Your email address is not verified yet.
              </p>

              <button
                type="button"
                className="resend-verification-button"
                onClick={handleResendVerification}
                disabled={isResending}
              >
                {isResending
                  ? "Sending verification email..."
                  : "Resend verification email"}
              </button>
            </div>
          )}

          <button
            className="add-todo"
            type="submit"
            disabled={isSubmitting || isResending}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-login-prompt">
          Don't have an account? <Link to="/register">Register</Link>
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

export default LoginForm;
