import React from "react";
import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.css";

/**
 * A dedicated page for users immediately after registration.
 * This page serves as a celebratory welcome and an opportunity for light onboarding.
 */
const WelcomePage: React.FC = () => {
  // Placeholder image URLs for the two mascots
  const ayamiHeadshotImageUrl = "/images/ayami/Ayami_Bio_Page_3.png";
  const chiaraHeadshotImageUrl = "/images/chiara/Chiara_Headshot.png";

  return (
    // 1. Use the main container class
    <div className={styles.welcomeContainer}>
      <div className={styles.contentWrapper}>
        {/* Left Mascot Avatar */}
        <div className={styles.avatarContainer}>
          <img
            src={ayamiHeadshotImageUrl}
            alt="AnimeHub Mascot 1"
            className={styles.avatar}
          />
        </div>

        {/* Central Welcome Content */}
        <div className={styles.welcomeContent}>
          <h2>🎉 Welcome to AnimeHub!</h2>
          <p>
            Your journey begins now. We're thrilled to have you join our
            community.
          </p>

          <div className={styles.linkGroup}>
            {/* Secondary Link */}
            <Link
              to="/profile"
              className={`${styles.linkButton} ${styles.secondaryLink}`}
            >
              Setup Your Profile
            </Link>
            {/* Primary Link */}
            <Link
              to="/home"
              className={`${styles.linkButton} ${styles.primaryLink}`}
            >
              Explore AnimeHub
            </Link>
          </div>
        </div>

        {/* Right Mascot Avatar */}
        <div className={styles.avatarContainer}>
          <img
            src={chiaraHeadshotImageUrl}
            alt="AnimeHub Mascot 2"
            className={styles.avatar}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
