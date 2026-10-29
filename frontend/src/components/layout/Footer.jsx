function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <a
          className="footer-brand"
          href="#top"
          aria-label="Return to Daily Memo home"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
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
        </a>

        <nav className="footer-links" aria-label="Footer navigation">
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Home
          </a>
          <a href="#todos">Todos</a>
          <a href="#contact">Contact us</a>
        </nav>

        <p className="footer-note">© {currentYear} Daily Memo</p>
      </div>
    </footer>
  );
}

export default Footer;
