import React from "react";
import {
  type CharacterProfileDto,
  type CharacterAttireDto,
} from "../../../../../api/types/CharacterTypes";
import { useCharacterAttireManagement } from "../../../../../hooks/TS/useCharacterAttireManagement";
import { CharacterAttireAddForm } from "../CharacterAttireAddForm";
import styles from "./CharacterAttireManagement.module.css";

interface CharacterAttireManagementProps {
  profile: CharacterProfileDto;
  profileId: number;
}

const CharacterAttireManagement: React.FC<CharacterAttireManagementProps> = ({
  profile,
}) => {
  const { profileToRender, handleDelete, isDeleting } =
    useCharacterAttireManagement(profile);

  const renderAttireCard = (attire: CharacterAttireDto) => (
    <div key={attire.characterAttireId} className={styles.attireCard}>
      <div className={styles.attireHeader}>
        <h4 className={styles.attireTitle}>{attire.name}</h4>
        <button
          onClick={() => handleDelete(attire.characterAttireId, attire.name)}
          className={styles.deleteButton}
          disabled={isDeleting || profileToRender.attires.length === 1}
        >
          {isDeleting ? "Deleting..." : "Delete Attire"}
        </button>
      </div>

      <p className={styles.attireDescription}>{attire.description}</p>
      <p className={styles.attireHairstyle}>
        Hairstyle: {attire.hairstyleDescription}
      </p>

      <h5 className={styles.accessoryTitle}>
        Accessories ({attire.accessories.length})
      </h5>
      <ul className={styles.accessoryList}>
        {attire.accessories.map((acc) => (
          <li key={acc.characterAccessoryId}>
            {acc.description}{" "}
            {acc.isWeapon && <span className={styles.weaponTag}>(Weapon)</span>}
          </li>
        ))}
      </ul>
    </div>
  );

  const handleAttireAdded = () => {
    // Optional: add scroll-to-top logic here if needed later
  };

  return (
    <div>
      <div className={styles.attireSplitContainer}>
        {/* ADD NEW ATTIRE FORM (FIXED LEFT PANEL) */}
        <div className={styles.attireAddFormPanel}>
          <h3 className={styles.attirePanelTitle}>Add New Attire</h3>
          <CharacterAttireAddForm
            profile={profile}
            profileId={profile.characterProfileId}
            onSuccess={handleAttireAdded}
          />
        </div>

        {/* ATTIRE LIST (SCROLLABLE RIGHT PANEL) */}
        <div className={styles.attireListPanel}>
          <h3 className={styles.attirePanelTitle}>
            Current Attires ({profileToRender.attires.length})
          </h3>

          <div className={styles.attireListContainer}>
            {profileToRender.attires.length > 0 ? (
              profileToRender.attires.map(renderAttireCard)
            ) : (
              <p>No attires found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterAttireManagement;
