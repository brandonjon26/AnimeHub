import React from "react";
import styles from "./AyamiAvatar.module.css"; // For scoped styles

const AyamiAvatar: React.FC = () => {
  return (
    <div className={styles.avatarContainer}>
      <h3 className={styles.title}>AnimeHub Avatar</h3>
      <p className={styles.name}>Ayami</p>

      {/* 🔑 REFERENCE IMAGE: For the sidebar avatar */}
      <img
        src="/images/ayami/Ayami_Side_Panel.png"
        alt="AnimeHub Mascot Ayami"
        className={styles.avatarImage}
      />

      <br />

      <small className={styles.tagline}>The Bewitching Beauty</small>
    </div>
  );
};

export default AyamiAvatar;
