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

  // Handle input changes
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

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();

    if (submissionStarted.current || isSubmitting) {
      return;
    }

    if (!token) {
      setToast({
        type: "error",
        message: "Invalid or missing password reset token.",
      });
      return;
    }

    // Validate form data
    const validation = validateResetPasswordDto(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    submissionStarted.current = true;
    setIsSubmitting(true);
    setErrors({});

    try {
      // Call reset password API
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
    <section className="auth-card">
      <div className="auth-card-header">
        <h1>Reset Password</h1>

        <p>
          {isResetSuccessful
            ? "Your password has been updated successfully."
            : "Enter your new password below."}
        </p>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {isResetSuccessful ? (
        <div className="auth-form">
          <p className="success-message">
            Your password has been changed. You can now log in using your new
            password.
          </p>

          <button
            type="button"
            className="auth-button"
            onClick={() => navigate("/login", { replace: true })}
          >
            Go to Login
          </button>
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="password">New Password</label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your new password"
              autoComplete="new-password"
              disabled={isSubmitting}
              required
            />

            {errors.password && (
              <p className="field-error">{errors.password}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              autoComplete="new-password"
              disabled={isSubmitting}
              required
            />

            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>

          <p className="auth-footer-text">
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </form>
      )}
    </section>
  );
}
