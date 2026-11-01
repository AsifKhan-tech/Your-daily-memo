import { useEffect, useState } from "react";
import { getUserProfile } from "../services/authService.js";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await getUserProfile();

        console.log("Profile response:", response);

        setProfile(response.data);
      } catch (error) {
        console.error("Profile error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>My Profile</h1>

      {profile && (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
          <p>Email verified: {profile.isVerified ? "Yes" : "No"}</p>
        </div>
      )}
    </section>
  );
}

export default ProfilePage;
