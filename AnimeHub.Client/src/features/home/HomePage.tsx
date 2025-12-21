import React from "react";
import ThemeToggle from "../../components/common/ThemeToggle";
import styles from "./HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <>
      <h2>Welcome to AnimeHub!</h2>
      <p>This is the central page for announcements and featured content.</p>

      {/* Placeholder for testing theme toggle: */}
      <p className={styles.themeStatus}>
        Current Theme Status: <ThemeToggle />
      </p>

      {/* Simple placeholders to test the layout zones */}
      <div className={styles.announcementContainer}>
        [Announcements & Featured Anime Section Placeholder]
      </div>
    </>
  );
};

export default HomePage;
