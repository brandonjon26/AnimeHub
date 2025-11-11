import React, { type ReactNode, useState } from "react";
import { NavLink, useLocation, Outlet } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import AyamiAvatar from "../AyamiAvatar";
import { useAuth } from "../../../hooks/useAuth";
import UserMenu from "../UserMenu";
import styles from "./MainLayout.module.css";

// -----------------------------------
// Helper Component for Hamburger Icon
// -----------------------------------
interface HamburgerProps {
  isOpen: boolean;
  onClick: () => void;
}

const HamburgerIcon: React.FC<HamburgerProps> = ({ isOpen, onClick }) => (
  <button
    className={styles.hamburger}
    onClick={onClick}
    aria-expanded={isOpen}
    aria-label="Toggle Navigation Sidebar"
  >
    {/* Simple text icon for now, can be replaced with an SVG/Font later */}
    {isOpen ? "✕" : "☰"}
  </button>
);
// ---------------------------------------------------------

const MainLayout: React.FC = () => {
  // State for the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const { user } = useAuth();

  // Get current path
  const location = useLocation();
  // Check if we are on the Home page
  const isHomePage = location.pathname === "/home" || location.pathname === "/";

  // Provide a fallback name if user data isn't immediately available (shouldn't happen post-login)
  const userName = user?.firstName || "User";

  return (
    <div className={styles.layoutContainer}>
      {/* 1. TOP NAVBAR (Vision: Home, Anime, Merchandise, Icon, Logout, Profile) */}
      <header className={styles.header}>
        {/* 🔑 New Hamburger Icon */}
        <div className={styles.userActionsLeft}>
          <HamburgerIcon isOpen={isSidebarOpen} onClick={toggleSidebar} />

          <div className={styles.logo}>AnimeHub [Icon]</div>
        </div>

        {/* Navigation Links */}
        <nav className={styles.navLinks}>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Home
          </NavLink>
          {/* 🔑 New Navigation Link for Ayami */}
          <NavLink
            to="/ayami"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Meet Ayami
          </NavLink>
          <NavLink
            to="/anime"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Anime
          </NavLink>
          <NavLink
            to="/merchandise"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.link
            }
          >
            Merchandise
          </NavLink>
        </nav>

        <div className={styles.userActions}>
          <ThemeToggle />
          <UserMenu userName={userName} />
        </div>
      </header>

      {/* 2. MAIN CONTENT AREA (Vision: Sidebar, Page Content, Avatar) */}
      <main className={styles.mainContent}>
        {/* Left Sidebar: Conditional class for collapsing */}
        <aside
          className={`${styles.sidebar} ${
            isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed
          }`}
        >
          <div className={styles.sidebarContent}>
            <h3>Watchlists</h3>
            <ul>
              <li>[Placeholder 1]</li>
              <li>[Placeholder 2]</li>
            </ul>
            <h3>Settings</h3>
          </div>
        </aside>

        {/* Center Page Content (Vision: Announcements, Featured Items) */}
        <section className={styles.pageContent}>
          <Outlet />
          {/* This renders the actual HomePage or other route components */}
        </section>

        {/* Right Avatar (Vision: Custom AnimeHub Character) */}
        {isHomePage && (
          <aside className={styles.avatarArea}>
            <AyamiAvatar />
          </aside>
        )}
      </main>

      {/* Optional: Footer */}
      <footer className={styles.footer}>© 2025 AnimeHub</footer>
    </div>
  );
};

export default MainLayout;
