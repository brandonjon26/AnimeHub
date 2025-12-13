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
          src={`/images/headshot/${secondaryProfile.firstName.toLowerCase()}/Headshot.png`}
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
          <strong>Feat:</strong> {secondaryProfile.greatestFeat?.title}
        </p>
      </div>
      {/* Assume edit overlay is handled by the onClick wrapper in the parent component */}
    </div>
  );
};

// --- NEW COMPONENT: Nested Vertical Attire Navigation ---

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
    // NOTE: This class needs styling to implement the desired flex/grid layout for nested nav
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

  // Helper function for Best Friend Tab content (now separate)
  const renderBestFriendTab = () => (
    <div className={styles.loreSection}>
      <h2>{secondaryProfile?.firstName}'s Profile Summary</h2>
      {secondaryProfile ? (
        <SecondaryCharacterCard
          secondaryProfile={secondaryProfile}
          onEditClick={onEditClick}
        />
      ) : (
        <p>No best friend data available.</p>
      )}
    </div>
  );

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
                {/* 🔑 Item 2: Placeholder for View Full Lore button */}
                <button className={styles.viewLoreButton}>
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
                      {primaryProfile.bestFriend.lastName}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 🔑 Render Best Friend Tab Content */}
        {activeTab === "bestFriend" &&
          secondaryProfile &&
          renderBestFriendTab()}

        {/* 🔑 Render Shared Quest Tab Content */}
        {activeTab === "sharedQuest" && renderSharedLoreTab()}

        {/* 🔑 Render Attires/Outfits Tab Content (NEW Structure) */}
        {activeTab === "attires" && primaryProfile.attires.length > 0 && (
          <AttireDetailsContent profile={primaryProfile} />
        )}
      </div>
    </div>
  );
};

export default CharacterLoreReveal;
