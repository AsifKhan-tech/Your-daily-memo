import { Link, useNavigate } from "react-router";

function NotFoundPage() {
  const navigate = useNavigate();

  function handleGoBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  }

  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-illustration" aria-hidden="true">
          <span className="not-found-orbit orbit-one"></span>
          <span className="not-found-orbit orbit-two"></span>
          <span className="not-found-number">404</span>
          <span className="not-found-star star-one">✦</span>
          <span className="not-found-star star-two">✧</span>
        </div>

        <p className="eyebrow">Page not found</p>

        <h1>Oops! Lost your way?</h1>

        <p className="not-found-description">
          The page you're looking for doesn't exist, may have been moved, or the
          link might be incorrect.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-home-button">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 10 9-7 9 7" />
              <path d="M5 9v12h14V9" />
              <path d="M9 21v-7h6v7" />
            </svg>
            Back to Home
          </Link>

          <button
            type="button"
            className="not-found-back-button"
            onClick={handleGoBack}
          >
            Go Back
          </button>
        </div>

        <div className="not-found-footer-note">
          <span>DAILY MEMO</span>
          <span className="not-found-dot">•</span>
          <span>Let's get you back on track.</span>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
