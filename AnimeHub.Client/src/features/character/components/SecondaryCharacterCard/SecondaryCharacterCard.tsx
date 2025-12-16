import React, { useState } from "react";
import { type CharacterProfileDto } from "../../../../api/types/CharacterTypes";
import EditableHeadshot from "../EditableHeadshot/EditableHeadshot"; // Import our new reusable component
import { renderBio } from "../../../../utils/JS/renderBioUtils";
import styles from "./SecondaryCharacterCard.module.css";

interface SecondaryCharacterCardProps {
  secondaryProfile: CharacterProfileDto;
  onEditClick: (character: CharacterProfileDto) => void;
  isAdminAccess: boolean;
}

const SecondaryCharacterCard: React.FC<SecondaryCharacterCardProps> = ({
  secondaryProfile,
  onEditClick,
  isAdminAccess,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // For public visibility expansion
  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded((prev) => !prev);
  };

  const fullBio = secondaryProfile.bio;

  return (
    <div
      className={`${styles.secondaryCharacterCard} ${
        !isAdminAccess ? styles.secondaryCharacterCardNoHover : ""
      }`}
    >
      {/* 1. Image Container (Uses Reusable Headshot) */}
      <EditableHeadshot
        profile={secondaryProfile}
        isAdminAccess={isAdminAccess}
        onEditClick={onEditClick} // Handler passed from parent
        size="secondary" // Ensures the small size and orange border
      />

      {/* 2. Summary Details (Public/Expandable Area) */}
      <div className={styles.summaryDetails}>
        <div className={styles.summaryHeader}>
          <h4>
            {secondaryProfile.firstName} {secondaryProfile.lastName}
          </h4>

          {/* EXPAND/COLLAPSE BUTTON */}
          <button
            className={styles.expandButton}
            onClick={handleToggleExpand}
            aria-expanded={isExpanded}
            aria-controls={`bio-for-${secondaryProfile.firstName}`}
            title={isExpanded ? "Collapse Details" : "Expand Details"}
          >
            {isExpanded ? "▲" : "▼"}
          </button>
        </div>

        {/* Fixed Summary Content */}
        <div>
          <strong>Vibe:</strong> {secondaryProfile.vibe}
        </div>
        <div>
          <strong>Unique Power:</strong> {secondaryProfile.uniquePower}
        </div>
        <div>
          <strong>Greatest Feat:</strong> {secondaryProfile.greatestFeat?.title}
        </div>

        {/* EXPANDED CONTENT AREA */}
        {isExpanded && (
          <div
            id={`bio-for-${secondaryProfile.firstName}`}
            className={styles.expandedBioSection}
          >
            <h5 className={styles.keyDetailsTitle}>Full Biography</h5>
            {renderBio(fullBio)}
            <h5 className={styles.keyDetailsTitle}>Core Details</h5>
            <ul className={styles.keyList}>
              <li>
                <b>Age:</b> {secondaryProfile.age}
              </li>
              <li>
                <b>Body Type:</b> {secondaryProfile.bodyType}
              </li>
              <li>
                <b>Origin:</b> {secondaryProfile.origin}
              </li>
              <li>
                <b>Best Friend:</b> {secondaryProfile.bestFriend?.firstName}{" "}
                {secondaryProfile.bestFriend?.lastName} 💜
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondaryCharacterCard;
