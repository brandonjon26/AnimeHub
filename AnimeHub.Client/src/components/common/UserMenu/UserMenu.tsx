import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { FaUserAlt } from "react-icons/fa";
import styles from "./UserMenu.module.css";

interface UserMenuProps {
  // We pass the user's initial or first name to display in the profile area
  userName: string;
}

const UserMenu: React.FC<UserMenuProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  // Handler for clicking outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className={styles.userMenuContainer} ref={menuRef}>
      {/* The primary button/icon (e.g., Profile Icon or User Initial) */}
      <button
        className={styles.profileButton}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`User Menu for ${userName}`}
      >
        <FaUserAlt size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={styles.dropdownMenu} role="menu">
          {/* View Profile */}
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("/profile")}
            role="menuitem"
          >
            View Profile
          </button>

          {/* Settings (already exists in the sidebar, but good for quick access) */}
          <button
            className={styles.menuItem}
            onClick={() => handleNavigation("/settings")}
            role="menuitem"
          >
            Settings
          </button>

          {/* Logout */}
          <button
            className={`${styles.menuItem} ${styles.logoutItem}`}
            onClick={handleLogout}
            role="menuitem"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
