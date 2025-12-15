import React from "react";
import { type CharacterProfileDto } from "../../../../api/types/CharacterTypes";
import styles from "./EditableHeadshot.module.css";

interface EditableHeadshotProps {
  profile: CharacterProfileDto;
  isAdminAccess: boolean;
  onEditClick: (profile: CharacterProfileDto) => void;
  size?: "primary" | "secondary";
}

const EditableHeadshot: React.FC<EditableHeadshotProps> = ({
  profile,
  isAdminAccess,
  onEditClick,
  size = "primary",
}) => {
  // --- Conditional Logic ---
  const imagePath = `/images/headshot/${profile.firstName.toLowerCase()}/Headshot.png`;

  // Determine the size class
  const containerSizeClass =
    size === "secondary"
      ? styles.headshotContainerSecondary
      : styles.headshotContainerPrimary;

  // Combine classes: Base + Size + Disabled status
  const containerClasses = [
    styles.headshotContainer,
    containerSizeClass,
    !isAdminAccess ? styles.headshotContainerDisabled : "",
  ].join(" ");

  // Determine overlay text
  const overlayText = size === "secondary" ? "Edit" : "Edit Profile";

  // --- Click Handler ---
  const handleClick = () => {
    if (isAdminAccess) {
      onEditClick(profile);
    }
  };

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      title={
        isAdminAccess
          ? `Edit ${profile.firstName} Profile`
          : `${profile.firstName}'s Headshot`
      }
    >
      <img
        src={imagePath}
        alt={`${profile.firstName} Headshot`}
        className={styles.headshotImage}
      />
      {isAdminAccess && (
        <span className={styles.editOverlay}>{overlayText}</span>
      )}
    </div>
  );
};

export default EditableHeadshot;
