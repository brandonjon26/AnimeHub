import React, { useState } from "react";
import { type CharacterProfileDto } from "../../../../api/types/CharacterTypes";
import { renderBio } from "../../../../hooks/renderBioUtils"; // Shared utility
import styles from "./AttireDetailsContent.module.css"; // Dedicated styles

interface AttireDetailsContentProps {
  profile: CharacterProfileDto;
}

const AttireDetailsContent: React.FC<AttireDetailsContentProps> = ({
  profile,
}) => {
  // Use the first attire's name as the default active one
  const [activeAttireName, setActiveAttireName] = useState<string>(
    profile.attires[0]?.name || ""
  );

  const activeAttire = profile.attires.find((a) => a.name === activeAttireName);

  if (!activeAttire) {
    return <p>No attire details available.</p>;
  }

  return (
    <div className={styles.attireLayout}>
      {/* 1. Vertical Navigation Bar (Left Side) */}
      <nav className={styles.attireVerticalNav}>
        <h4 className={styles.verticalNavHeader}>Attire List</h4>
        {profile.attires.map((attire) => (
          <button
            key={attire.name}
            className={`${styles.verticalNavLink} ${
              activeAttireName === attire.name
                ? styles.verticalNavLinkActive
                : ""
            }`}
            onClick={() => setActiveAttireName(attire.name)}
          >
            {attire.name}
          </button>
        ))}
      </nav>

      {/* 2. Attire Details Content (Right Side) */}
      <div className={styles.attireDetailsContent}>
        <h2>
          {activeAttire.name} Details ({activeAttire.attireType})
        </h2>
        <p className={styles.loreParagraph}>{activeAttire.description}</p>

        <h3 className={styles.keyDetailsTitle}>Hairstyle</h3>
        <p className={styles.loreParagraph}>
          {activeAttire.hairstyleDescription}
        </p>

        <h3 className={styles.keyDetailsTitle}>Accessories</h3>
        <ul className={styles.keyList}>
          {activeAttire.accessories.map((acc) => (
            <li key={acc.characterAccessoryId}>
              <b>{acc.isWeapon ? "Weapon" : "Accessory"}:</b> {acc.description}
              {acc.uniqueEffect && <span> (Effect: {acc.uniqueEffect})</span>}
            </li>
          ))}
          {activeAttire.accessories.length === 0 && (
            <li>No special accessories recorded for this attire.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AttireDetailsContent;
