import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { resetPassword } from "../services/authService";
import { validateResetPasswordDto } from "../dto/resetPassword.dto";
import Toast from "../../../components/ui/Toast";

export default function ResetPasswordForm() {
  const { token } = useParams();
  const navigate = useNavigate();
  const submissionStarted = useRef(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
    setErrors((previous) => ({
      ...previous,
      [name]: "",
      ...(name === "password" ? { confirmPassword: "" } : {}),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submissionStarted.current || isSubmitting) return;

    if (!token) {
      setToast({
        type: "error",
        message: "Invalid or missing password reset token.",
      });
      return;
    }

    const validation = validateResetPasswordDto(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    submissionStarted.current = true;
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await resetPassword(token, validation.data.password);
      setIsResetSuccessful(true);
      setToast({
        type: "success",
        message:
          result?.message || "Your password has been reset successfully.",
      });
    } catch (error) {
      setToast({
        type: "error",
        message: error.message || "Unable to reset password. Please try again.",
      });
      submissionStarted.current = false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="todo-container auth-container login-container">
        <div className="register-heading">
          <div>
            <p className="eyebrow">Account Recovery</p>
            <h1>Reset Password</h1>
          </div>
        </div>

        {isResetSuccessful ? (
          <div className="login-form">
            <p className="forgot-password-description">
              Your password has been changed successfully. You can now log in
              using your new credentials.
            </p>
            <button
              type="button"
              className="add-todo"
              style={{ width: "100%", marginTop: "1rem" }}
              onClick={() => navigate("/login", { replace: true })}
            >
              Go to Login
            </button>
          </div>
        ) : (
          <>
            <p className="forgot-password-description">
              Enter your new password below. Make sure it is at least 8
              characters long.
            </p>
            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="input-group">
                <label htmlFor="password">
                  New Password <span className="required-indicator">*</span>
                </label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="todo"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((prev) => !prev)}
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
                  <small className="field-error">{errors.password}</small>
                )}

                <label htmlFor="confirmPassword">
                  Confirm Password <span className="required-indicator">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="todo"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  required
                />
                {errors.confirmPassword && (
                  <small className="field-error">
                    {errors.confirmPassword}
                  </small>
                )}
              </div>

              <button
                type="submit"
                className="add-todo"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>
            </form>
          </>
        )}

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
