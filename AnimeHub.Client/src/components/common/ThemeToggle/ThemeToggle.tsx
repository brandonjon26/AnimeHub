import React from "react";
import { useTheme } from "../../../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className={styles.themeButton}>
      {/* Dynamic button text based on current theme */}
      Switch to {theme === "dark" ? "Light Mode 💡" : "Dark Mode 🌙"}
    </button>
  );
};

export default ThemeToggle;
