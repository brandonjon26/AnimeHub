import React from "react";
// import MainLayout from "../../components/common/MainLayout";
import ThemeToggle from "../../components/common/ThemeToggle"; // We will create this next

const HomePage: React.FC = () => {
  return (
    // Wrap the Home Page content in the structural layout
    <>
      <h2>Welcome to AnimeHub!</h2>
      <p>This is the central page for announcements and featured content.</p>

      {/* 🔑 Placeholder for testing theme toggle: */}
      <p style={{ marginTop: "20px" }}>
        Current Theme Status: <ThemeToggle />
      </p>

      {/* Simple placeholders to test the layout zones */}
      <div
        style={{
          padding: "20px",
          border: "1px solid var(--color-accent-purple)",
          marginTop: "20px",
        }}
      >
        [Announcements & Featured Anime Section Placeholder]
      </div>
    </>
  );
};

export default HomePage;
