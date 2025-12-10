import React, { useState } from "react";
import { type CharacterProfileDto } from "../../api/types/CharacterTypes";
import {
  CharacterProfileUpdateForm,
  CharacterAttireManagement,
} from "./components";
import styles from "./CharacterProfileEditModal.module.css";

interface CharacterProfileEditModalProps {
  profile: CharacterProfileDto;
  profileId: number;
  onClose: () => void;
}

const TABS = {
  PROFILE: "Profile",
  ATTIRE: "Attire Management",
};

const CharacterProfileEditModal: React.FC<CharacterProfileEditModalProps> = ({
  profile,
  profileId,
  onClose,
}) => {
  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState(TABS.PROFILE);

  const renderContent = () => {
    switch (activeTab) {
      case TABS.PROFILE:
        return (
          <CharacterProfileUpdateForm
            profile={profile}
            profileId={profileId}
            onSuccess={onClose} // Close modal on successful update
          />
        );
      case TABS.ATTIRE:
        return (
          <CharacterAttireManagement profile={profile} profileId={profileId} />
        );
      default:
        return null;
    }
  };

  return (
    // Modal Backdrop
    <div className={styles.modalBackdrop} onClick={onClose}>
      {/* Modal Content - Stop clicks from closing the modal */}
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Editing {profile.firstName}'s Profile</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>

        {/* Ayami Headshot Image */}
        <div className={styles.headshotWrapper}>
          <img
            src={`/images/${profile.firstName.toLowerCase()}/Ayami_Bio_Page_3.png`} // Reusing the same image
            alt={`${profile.firstName} Headshot`}
            className={styles.modalHeadshot}
          />
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabContainer}>
          {Object.values(TABS).map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.modalBody}>{renderContent()}</div>

        <div className={styles.modalFooter}>
          {/* The Save button moved inside the form, so this is just for closing */}
          <button onClick={onClose} className={styles.cancelButton}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfileEditModal;
