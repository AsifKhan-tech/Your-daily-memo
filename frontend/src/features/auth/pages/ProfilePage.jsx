import { useAuth } from "../context/AuthContext.jsx";

function formatRegistrationDate(date) {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <section className="profile-page">
        <p role="status">Loading your profile...</p>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="profile-page">
        <p role="alert">Unable to load your profile. Please login again.</p>
      </section>
    );
  }

  const fullName = user.name || "User";
  const avatarLetter = fullName.charAt(0).toUpperCase();

  return (
    <section className="profile-page">
      <article className="profile-card">
        <header className="profile-card-header">
          <p className="eyebrow">Daily Memo</p>
          <h1>My Profile</h1>
          <p className="profile-card-subtitle">
            Your personal account information
          </p>
        </header>

        <div className="profile-card-identity">
          <div className="profile-avatar" aria-hidden="true">
            {avatarLetter}
          </div>

          <h2>{fullName}</h2>

          <span className="profile-role-badge">{user.role || "User"}</span>
        </div>

        <div className="profile-details">
          <div className="profile-detail-item">
            <span className="profile-detail-label">Full Name</span>
            <p>{fullName}</p>
          </div>

          <div className="profile-detail-item">
            <span className="profile-detail-label">Email Address</span>
            <p>{user.email || "Not available"}</p>
          </div>

          <div className="profile-detail-item">
            <span className="profile-detail-label">Role</span>
            <p>{user.role || "User"}</p>
          </div>

          <div className="profile-detail-item">
            <span className="profile-detail-label">Member Since</span>
            <p>{formatRegistrationDate(user.createdAt)}</p>
          </div>
        </div>

        <footer className="profile-card-footer">
          <span
            className={
              user.isVerified
                ? "profile-verification verified"
                : "profile-verification unverified"
            }
          >
            {user.isVerified ? "Email verified" : "Email not verified"}
          </span>
        </footer>
      </article>
    </section>
  );
}

export default ProfilePage;
