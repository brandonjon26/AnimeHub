import React, { useState } from "react";
import {
  type CharacterProfileDto,
  type CharacterProfileSummaryDto,
  type CharacterLoreLinkDto,
} from "../../api/types/CharacterTypes";
import styles from "./AboutCharacterPage.module.css";

interface CharacterLoreRevealProps {
  primaryProfile: CharacterProfileDto;
  secondaryProfile: CharacterProfileDto | undefined;
  onEditClick: (character: CharacterProfileDto) => void;
}

// Helper function to render markdown-style bio text (using primary profile data)
const renderBio = (text: string) => {
  return text.split("\n\n").map((paragraph, index) => (
    <p
      key={index}
      className={styles.loreParagraph} // Use a new dedicated class
      dangerouslySetInnerHTML={{
        __html: paragraph
          .trim()
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
      }}
    />
  ));
};

// Component to display a summary card for the secondary character (Chiara)
// Includes the required edit modal functionality
interface SecondaryCharacterCardProps {
  secondaryProfile: CharacterProfileDto;
  onEditClick: (character: CharacterProfileDto) => void;
}

const SecondaryCharacterCard: React.FC<SecondaryCharacterCardProps> = ({
  secondaryProfile,
  onEditClick,
}) => {
  // Assuming isAdminAccess logic is available (either passed down or imported via useAuth)
  // Since this is a nested component, let's assume it has access to useAuth or the check is passed down.
  // We will assume `isAdminAccess` is passed down, or better, keep the responsibility with the parent.
  // For now, we will just implement the click handler.

  const handleEditClick = () => {
    onEditClick(secondaryProfile);
  };

  // Using a separate component to keep this clean.
  return (
    <div
      className={styles.secondaryCharacterCard}
      onClick={handleEditClick}
      title={`Edit ${secondaryProfile.firstName} Profile`}
    >
      <div className={styles.headshotContainer}>
        {/* Image source needs to be dynamic for Chiara */}
        <img
          src={`/images/${secondaryProfile.firstName.toLowerCase()}/Chiara_Headshot.png`}
          alt={`${secondaryProfile.firstName} Headshot`}
          className={styles.headshotImage}
        />
      </div>

      <div className={styles.summaryDetails}>
        <h4>
          {secondaryProfile.firstName} {secondaryProfile.lastName}
        </h4>
        <p>
          <strong>Vibe:</strong> {secondaryProfile.vibe}
        </p>
        <p>
          <strong>Unique Power:</strong> {secondaryProfile.uniquePower}
        </p>
        {/* Display Ayami's Greatest Feat if she has one, but link to Chiara's data */}
        <p>
          <strong>Feat:</strong> {secondaryProfile.greatestFeat}
        </p>
      </div>
      {/* Assume edit overlay is handled by the onClick wrapper in the parent component */}
    </div>
  );
};

// --- CORE COMPONENT ---

const CharacterLoreReveal: React.FC<CharacterLoreRevealProps> = ({
  primaryProfile,
  secondaryProfile,
  onEditClick,
}) => {
  // State to manage which section is active: 'lore' (bio/key details) or an attire name
  const [activeTab, setActiveTab] = useState<string>("lore");

  // Combine all core details for easy access
  const fullName = `${primaryProfile.firstName} ${primaryProfile.lastName}`;
  const japaneseName = `${primaryProfile.japaneseFirstName} ${primaryProfile.japaneseLastName}`;

  // Find the primary weapon/accessory for the Key Details (used in the 'lore' tab)
  const primaryAttire = primaryProfile.attires[0];
  const equipmentAccessory = primaryAttire?.accessories.find(
    (acc) => acc.isWeapon
  );

  // --- Shared Lore Logic (Item 3.5) ---
  // Filter the lore links to find quests where the secondary character is also involved (optional, but clean)
  // Since all lore links are already loaded on Ayami's profile, we just need to list them.
  // We can further refine this in the future if needed, but for now, we show all linked lore.
  const sharedLoreEntries = primaryProfile.loreLinks;

  const hasSharedLore = sharedLoreEntries.length > 0;

  // Prepare content for a Shared Quest Tab
  const renderSharedLoreTab = () => (
    <div className={styles.loreSection}>
      <h2>Shared Universe Links</h2>

      {/* Display Secondary Character (Chiara) summary */}
      {secondaryProfile ? (
        <>
          <h3 className={styles.keyDetailsTitle}>
            {secondaryProfile.firstName} {secondaryProfile.lastName}
          </h3>
          <SecondaryCharacterCard
            secondaryProfile={secondaryProfile}
            onEditClick={onEditClick}
          />
        </>
      ) : (
        <p>No secondary character data available.</p>
      )}

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
                {/* Future: Add a button to view full LoreEntry details */}
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
        {/* 1. Core Lore Tab */}
        <button
          className={`${styles.tabButton} ${
            activeTab === "lore" ? styles.tabActive : ""
          }`}
          onClick={() => setActiveTab("lore")}
        >
          📜 Lore & Details
        </button>

        {/* 2. Shared Lore Tab (Item 3.5 & Chiara Integration) */}
        {secondaryProfile && ( // Only show if we successfully fetched the secondary character
          <button
            className={`${styles.tabButton} ${
              activeTab === "shared" ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab("shared")}
          >
            🤝 Shared Quest & Best Friend
          </button>
        )}

        {/* 3. Attire Tabs (one for each attire) */}
        {primaryProfile.attires.map((attire) => (
          <button
            key={attire.name}
            className={`${styles.tabButton} ${
              activeTab === attire.name ? styles.tabActive : ""
            }`}
            onClick={() => setActiveTab(attire.name)}
          >
            {attire.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "lore" && (
          <div className={styles.loreSection}>
            <h2>{primaryProfile.firstName}'s Story</h2>
            {renderBio(primaryProfile.bio)}

            <h3 className={styles.keyDetailsTitle}>Key Details</h3>
            <ul className={styles.keyList}>
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
              <li className={styles.detailSeparator}>
                <b>Unique Power:</b> {primaryProfile.uniquePower}
              </li>
              <li>
                <b>Magic Aptitude:</b> {primaryProfile.magicAptitude}
              </li>
              <li>
                <b>Greatest Feat:</b> {primaryProfile.greatestFeat}
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
                  {primaryProfile.bestFriend.lastName}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Render Shared Lore / Best Friend Tab */}
        {activeTab === "shared" && secondaryProfile && renderSharedLoreTab()}

        {/* Render Attire Detail when an attire tab is active */}
        {primaryProfile.attires.map(
          (attire) =>
            activeTab === attire.name && (
              <div key={attire.name} className={styles.loreSection}>
                <h2>
                  {attire.name} Details ({attire.attireType})
                </h2>
                <p className={styles.loreParagraph}>{attire.description}</p>

                <h3 className={styles.keyDetailsTitle}>Hairstyle</h3>
                <p className={styles.loreParagraph}>
                  {attire.hairstyleDescription}
                </p>

                <h3 className={styles.keyDetailsTitle}>Accessories</h3>
                <ul className={styles.keyList}>
                  {attire.accessories.map((acc) => (
                    <li key={acc.characterAccessoryId}>
                      <b>{acc.isWeapon ? "Weapon" : "Accessory"}:</b>{" "}
                      {acc.description}
                      {acc.uniqueEffect && (
                        <span> (Effect: {acc.uniqueEffect})</span>
                      )}
                    </li>
                  ))}
                  {attire.accessories.length === 0 && (
                    <li>No special accessories recorded for this attire.</li>
                  )}
                </ul>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default CharacterLoreReveal;
