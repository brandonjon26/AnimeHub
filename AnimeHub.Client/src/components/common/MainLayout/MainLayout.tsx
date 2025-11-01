import React, { type ReactNode } from "react";
import styles from "./MainLayout.module.css";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layoutContainer}>
      {/* 1. TOP NAVBAR (Vision: Home, Anime, Merchandise, Icon, Logout, Profile) */}
      <header className={styles.header}>
        <div className={styles.logo}>AnimeHub [Icon]</div>
        <div className={styles.navBar}>[Nav Links & Theme Toggle]</div>
      </header>

      {/* 2. MAIN CONTENT AREA (Vision: Sidebar, Page Content, Avatar) */}
      <main className={styles.mainContent}>
        {/* Left Sidebar (Vision: Hamburger Icon, Watchlists, Settings) */}
        <aside className={styles.sidebar}>
          [Sidebar / Hamburger Menu Placeholder]
        </aside>

        {/* Center Page Content (Vision: Announcements, Featured Items) */}
        <section className={styles.pageContent}>
          {children}{" "}
          {/* This renders the actual HomePage or other route components */}
        </section>

        {/* Right Avatar (Vision: Custom AnimeHub Character) */}
        <aside className={styles.avatarArea}>
          [AnimeHub Avatar Placeholder]
        </aside>
      </main>

      {/* Optional: Footer */}
      <footer className={styles.footer}>© 2025 AnimeHub</footer>
    </div>
  );
};

export default MainLayout;
