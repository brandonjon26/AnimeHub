import React from "react";
import { useTheme } from "../../../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      // 🔑 Replace the inline style prop with the class name from the module
      className={styles.themeButton}
      // Note: We can remove the style={{...}} prop entirely now.
    >
      {/* Dynamic button text based on current theme */}
      Switch to {theme === "dark" ? "Light Mode 💡" : "Dark Mode 🌙"}
    </button>
  );
};

export default ThemeToggle;
