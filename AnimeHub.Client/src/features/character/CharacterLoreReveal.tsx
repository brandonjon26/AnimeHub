import React, { useState } from "react";
import Modal from "../../components/common/modal";
import {
  type CharacterProfileDto,
  type CharacterLoreLinkDto,
} from "../../api/types/CharacterTypes";
import { renderBio } from "../../hooks/renderBioUtils";
import { SecondaryCharacterCard } from "./components/SecondaryCharacterCard";
import AttireDetailsContent from "./components/AttireDetailsContent/AttireDetailsContent";
import styles from "./AboutCharacterPage.module.css";

interface CharacterLoreRevealProps {
  primaryProfile: CharacterProfileDto;
  secondaryProfile: CharacterProfileDto | undefined;
  onEditClick: (character: CharacterProfileDto) => void;
  isAdminAccess: boolean;
}

// Helper function for Best Friend Tab content (now separate)
const renderBestFriendTab = (
  secondaryProfile: CharacterProfileDto,
  onEditClick: (character: CharacterProfileDto) => void,
  isAdminAccess: boolean
) => (
  <div className={styles.loreSection}>
    <h2>{secondaryProfile?.firstName}'s Profile Summary</h2>
    {secondaryProfile ? (
      <SecondaryCharacterCard
        secondaryProfile={secondaryProfile}
        onEditClick={onEditClick}
        isAdminAccess={isAdminAccess}
      />
    ) : (
      <p>No best friend data available.</p>
    )}
  </div>
);

// --- CORE COMPONENT ---

const CharacterLoreReveal: React.FC<CharacterLoreRevealProps> = ({
  primaryProfile,
  secondaryProfile,
  onEditClick,
  isAdminAccess,
}) => {
  // State to manage which section is active: 'lore' (bio/key details) or an attire name
  const [activeTab, setActiveTab] = useState<string>("lore");
  // State to hold the lore entry for the modal
  const [modalLoreEntry, setModalLoreEntry] =
    useState<CharacterLoreLinkDto | null>(null);

  // Handlers to open and close the modal
  const handleViewFullLore = (entry: CharacterLoreLinkDto) => {
    setModalLoreEntry(entry);
  };

  const handleCloseModal = () => {
    setModalLoreEntry(null);
  };

  // Combine all core details for easy access
  const fullName = `${primaryProfile.firstName} ${primaryProfile.lastName}`;
  const japaneseName = `${primaryProfile.japaneseFirstName} ${primaryProfile.japaneseLastName}`;

  // Find the primary weapon/accessory for the Key Details (used in the 'lore' tab)
  const primaryAttire = primaryProfile.attires[0];
  const equipmentAccessory = primaryAttire?.accessories.find(
    (acc) => acc.isWeapon
  );

  // Filter the lore links to find quests where the secondary character is also involved (optional, but clean)
  const sharedLoreEntries = primaryProfile.loreLinks;
  const hasSharedLore = sharedLoreEntries.length > 0;

  // Prepare content for a Shared Quest Tab
  const renderSharedLoreTab = () => (
    <div className={styles.loreSection}>
      <h2>Shared Universe Links</h2>

      <h3 className={styles.keyDetailsTitle}>
        Linked Lore Entries ({sharedLoreEntries.length})
      </h3>

      {hasSharedLore ? (
        <ul className={styles.keyList}>
          {sharedLoreEntries.map(
            (link: CharacterLoreLinkDto, index: number) => (
              <li key={index} className={styles.loreEntryLink}>
                <b>{link.loreEntry.title}</b> ({link.loreEntry.loreType}) -
                Role: {link.characterRole || "N/A"}
                <p className={styles.loreLinkSummary}>
                  {link.loreEntry.narrative.substring(0, 150)}...
                </p>
                <button
                  className={styles.viewLoreButton}
                  onClick={() => handleViewFullLore(link)}
                >
                  View Full Lore
                </button>
              </li>
            )
          )}
        </ul>
      ) : (
        <p>
          No quests or shared history linked to {primaryProfile.firstName} yet.
        </p>
      )}
    </div>
  );

  return (
    <div className={styles.loreContainer}>
      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        {/* 1. Lore & Details */}
        <button
          className={`${styles.tabButton} ${
            activeTab === "lore" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("lore")}
        >
          📜 Lore & Details 📜
        </button>

        {/* 2. Best Friend (NEW Separate Tab) */}
        {secondaryProfile && ( // Only show if we successfully fetched the secondary character
          <button
            className={`${styles.tabButton} ${
              activeTab === "bestFriend" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("bestFriend")}
          >
            💜 Best Friend ❤️
          </button>
        )}

        {/* 3. Shared Quest (NEW Separate Tab) */}
        {primaryProfile.loreLinks.length > 0 && (
          <button
            className={`${styles.tabButton} ${
              activeTab === "sharedQuest" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("sharedQuest")}
          >
            🗺️ Shared Quest 🗺️
          </button>
        )}

        {primaryProfile.attires.length > 0 && (
          <button
            className={`${styles.tabButton} ${
              activeTab === "attires" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("attires")}
          >
            👗 Attires/Outfits 👗
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "lore" && (
          <div className={styles.loreSection}>
            <h2>{primaryProfile.firstName}'s Story</h2>
            {renderBio(primaryProfile.bio)}

            <h3 className={styles.keyDetailsTitle}>Key Details</h3>
            <div className={styles.keyDetailsWrapper}>
              <div className={styles.keyItem}>
                <ul className={`${styles.keyList} ${styles.detailSeparator}`}>
                  <li>
                    <b>Full Name:</b> {fullName} ({japaneseName})
                  </li>
                  <li>
                    <b>Age:</b> {primaryProfile.age}
                  </li>
                  <li>
                    <b>Origin:</b> {primaryProfile.origin || "Unknown Realm"}
                  </li>
                  <li>
                    <b>Vibe:</b> {primaryProfile.vibe}
                  </li>
                  <li>
                    <b>Height:</b> {primaryProfile.height}
                  </li>
                  <li>
                    <b>Body Type:</b> {primaryProfile.bodyType}
                  </li>
                  <li>
                    <b>Eyes:</b> {primaryProfile.eyes}
                  </li>
                  <li>
                    <b>Hair:</b> {primaryProfile.hair}
                  </li>
                  <li>
                    <b>Skin:</b> {primaryProfile.hair}
                  </li>
                </ul>
              </div>
              <div className={styles.keyItem}>
                <ul className={styles.keyList}>
                  <li>
                    <b>Unique Power:</b> {primaryProfile.uniquePower}
                  </li>
                  <li>
                    <b>Magic Aptitude:</b> {primaryProfile.magicAptitude}
                  </li>
                  <li>
                    <b>Greatest Feat:</b> {primaryProfile.greatestFeat?.title}
                  </li>
                  <li>
                    <b>Romantic Tension:</b>{" "}
                    {primaryProfile.romanticTensionDescription}
                  </li>
                  <li>
                    <b>Equipment:</b> {primaryProfile.primaryEquipment}
                  </li>
                  {equipmentAccessory && (
                    <li>
                      <b>Primary Weapon:</b> {equipmentAccessory.description}
                    </li>
                  )}
                  {primaryProfile.bestFriend && (
                    <li>
                      <b>Best Friend:</b> {primaryProfile.bestFriend.firstName}{" "}
                      {primaryProfile.bestFriend.lastName} ❤️
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Render Best Friend Tab Content */}
        {activeTab === "bestFriend" &&
          secondaryProfile &&
          renderBestFriendTab(secondaryProfile, onEditClick, isAdminAccess)}

        {/* Render Shared Quest Tab Content */}
        {activeTab === "sharedQuest" && renderSharedLoreTab()}

        {/* Render Attires/Outfits Tab Content (NEW Structure) */}
        {activeTab === "attires" && primaryProfile.attires.length > 0 && (
          <AttireDetailsContent profile={primaryProfile} />
        )}
      </div>

      {modalLoreEntry && (
        <Modal
          title={`${modalLoreEntry.loreEntry.title} (${modalLoreEntry.loreEntry.loreType})`}
          onClose={handleCloseModal}
        >
          {/* Render the full narrative using the existing helper function */}
          {renderBio(modalLoreEntry.loreEntry.narrative)}

          {/* Optional: Include metadata if needed */}
          <p className={styles.sourceSection}>
            Source ID: {modalLoreEntry.loreEntry.loreEntryId}
          </p>
        </Modal>
      )}
    </div>
  );
};

export default CharacterLoreReveal;
