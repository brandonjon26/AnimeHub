import React from "react";
import { useAuth } from "../../hooks/TS/useAuth";
import styles from "./ProfilePage.module.css";

/**
 * Displays the current user's profile information and provides links
 * for management (update, delete) and other user content (watchlists/wishlists).
 */
const ProfilePage: React.FC = () => {
  // Access current user data
  const { user, hasRole } = useAuth();

  // Default values for display
  const userId = user?.userId || "N/A";
  const userName = user?.userName || "N/A";
  const email = user?.email || "N/A";
  const firstName = user?.firstName || "N/A";
  const lastName = user?.lastName || "N/A";
  const roles = user?.roles?.join(", ") || "Villager"; // Display roles
  const isAdmin = user?.isAdmin || false;
  const isAdult = user?.isAdult ?? false;

  // Handlers for future implementation
  const handleUpdateProfile = () => {
    alert("Future feature: Open profile update form.");
  };

  const handleDeleteProfile = () => {
    // Will be replaced with a modal/confirmation flow later
    alert("Future feature: Confirm and delete profile.");
  };

  if (!user) {
    // Simple loading or not authenticated state
    return <div className={styles.loading}>Loading profile data...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.header}>👤 User Profile: {userName}</h2>
      <p className={styles.roleTag}>Current Role(s): **{roles}**</p>

      <div className={styles.contentGrid}>
        {/* Profile Details Card */}
        <div className={styles.detailsCard}>
          <h3>Basic Information</h3>
          <p>
            <strong>User ID:</strong> {userId}
          </p>
          <p>
            <strong>Username:</strong> {userName}
          </p>
          <p>
            <strong>Email:</strong> {email}
          </p>
          <p>
            <strong>Name:</strong> {firstName} {lastName}
          </p>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleUpdateProfile}
            >
              Update Profile
            </button>

            <button
              className={`${styles.button} ${styles.deleteButton}`}
              onClick={handleDeleteProfile}
            >
              Delete Profile
            </button>
          </div>
        </div>

        {/* Content Links Card */}
        <div className={styles.linksCard}>
          <h3>Your Hub Content</h3>
          <div className={styles.linkGroup}>
            <a
              href="#"
              className={styles.contentLink}
              onClick={(e) => e.preventDefault()}
            >
              📚 Saved Anime Watchlists (Placeholder)
            </a>
            <a
              href="#"
              className={styles.contentLink}
              onClick={(e) => e.preventDefault()}
            >
              🛍️ Merchandise WishList (Placeholder)
            </a>
          </div>

          {/* 🔑 Logic: Show Admin section only to users with Admin/Mage roles */}
          {isAdmin && (
            <div className={styles.adminSection}>
              <h4>Admin Tools</h4>
              <p>Access Admin Dashboard (Future Link)</p>
              {/* You could add a specific link here: */}
              {/* <a href="/admin/dashboard" className={styles.contentLink}>Go to Dashboard</a> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
