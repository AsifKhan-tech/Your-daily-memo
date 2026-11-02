import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../features/auth/context/AuthContext.jsx";
import Toast from "../ui/Toast.jsx";

export default function Header({ onLoginClick, onRegisterClick }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // 1. Manage the mobile navigation menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutToast, setLogoutToast] = useState(null);

  const profileMenuRef = useRef(null);

  // 2. Restore the saved theme, defaulting to dark.
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("daily-memo-theme") === "light"
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });

  // 3. Apply the theme whenever it changes.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("daily-memo-theme", theme);
    } catch {
      // The theme still works for the current session.
    }
  }, [theme]);

  // 4. Switch between light and dark modes.
  function handleThemeToggle() {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }

  // 5. Close the mobile menu after navigating.
  function handleNavigation() {
    setIsMenuOpen(false);
  }

  // Close profile dropdown when clicking outside or pressing Escape.
  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setLogoutToast(null);

    try {
      await logout();

      setIsProfileOpen(false);
      setIsMenuOpen(false);

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);

      setLogoutToast({
        type: "error",
        message: error.message || "Logout failed. Please try again.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="site-header" id="top">
      <nav
        className={`navbar ${isMenuOpen ? "is-menu-open" : ""}`}
        aria-label="Primary navigation"
      >
        {/* Brand */}
        <Link
          className="brand"
          to="/"
          aria-label="Daily Memo home"
          onClick={handleNavigation}
        >
          <span className="brand-mark" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 3h8l4 4v14H6z" />
              <path d="M14 3v5h4M9 13h6M9 17h4" />
            </svg>
          </span>

          <span>Daily Memo</span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation links and account controls */}
        <div className="nav-links" id="primary-nav">
          <a href="#home" onClick={handleNavigation}>
            Home
          </a>

          <a href="#todos" onClick={handleNavigation}>
            Todos
          </a>

          <a href="#contact" onClick={handleNavigation}>
            Contact us
          </a>

          {/* Authentication / Profile controls */}
          <div className="auth-actions" role="group" aria-label="Account">
            {isLoading ? null : !isAuthenticated ? (
              <>
                <button
                  className="auth-btn auth-btn-login"
                  type="button"
                  onClick={onLoginClick}
                >
                  Login
                </button>

                <button
                  className="auth-btn auth-btn-register"
                  type="button"
                  onClick={onRegisterClick}
                >
                  Register
                </button>
              </>
            ) : (
              <div className="profile-menu" ref={profileMenuRef}>
                <button
                  type="button"
                  className="profile-trigger"
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-controls="profile-dropdown"
                  onClick={() => setIsProfileOpen((previous) => !previous)}
                >
                  <span className="profile-avatar-small" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21a8 8 0 0 1 16 0" />
                    </svg>
                  </span>

                  <span className="profile-first-name">
                    {user?.name?.trim().split(/\s+/)[0] || "Account"}
                  </span>

                  <svg
                    className={`profile-chevron ${isProfileOpen ? "is-open" : ""}`}
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="profile-dropdown" id="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <span className="profile-avatar-large" aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="4" />
                          <path d="M4 21a8 8 0 0 1 16 0" />
                        </svg>
                      </span>

                      <strong>{user?.name}</strong>

                      <Link
                        to="/profile"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleNavigation();
                        }}
                      >
                        My Profile
                      </Link>
                    </div>

                    <div className="profile-dropdown-links">
                      <a href="/api-docs" onClick={handleNavigation}>
                        <span aria-hidden="true">▣</span>
                        API Docs
                        <span className="profile-new-badge">New</span>
                      </a>

                      <a href="/help" onClick={handleNavigation}>
                        <span aria-hidden="true">ⓘ</span>
                        Help
                      </a>

                      <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                      >
                        <span aria-hidden="true">↪</span>
                        {isLoggingOut ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            id="theme-toggle"
            type="button"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`${theme === "dark" ? "Light" : "Dark"} mode`}
            onClick={handleThemeToggle}
          >
            {/* Sun icon */}
            <svg
              className="theme-icon theme-icon-sun"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l-1.41 1.41M17.66 6.34l1.41-1.41" />
            </svg>

            {/* Moon icon */}
            <svg
              className="theme-icon theme-icon-moon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />
            </svg>
          </button>
        </div>
      </nav>
      {logoutToast && (
        <Toast
          type={logoutToast.type}
          message={logoutToast.message}
          onClose={() => setLogoutToast(null)}
        />
      )}
    </header>
  );
}
