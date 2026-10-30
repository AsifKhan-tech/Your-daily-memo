function Toast({ type = "success", message, onClose }) {
  // Match the reference mockup with a rounded success pill and a bordered check icon.
  return (
    <div
      className={`app-toast app-toast--${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
    >
      <span className="app-toast__icon" aria-hidden="true">
        {type === "success" && (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.5 2.5L16 9" />
          </svg>
        )}

        {type === "error" && (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="m9 9 6 6m0-6-6 6" />
          </svg>
        )}

        {type === "pending" && <span className="app-toast__spinner" />}
      </span>

      <p className="app-toast__message">{message}</p>

      <button
        type="button"
        className="app-toast__close"
        onClick={onClose}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}

export default Toast;
