import React, { useState } from "react";
import { type AyamiProfileDto } from "../../api/types/AyamiTypes";
import styles from "./AboutAyamiPage.module.css";

interface AyamiLoreRevealProps {
  profile: AyamiProfileDto;
}

// Helper function to render markdown-style bio text (copied from AyamiContent)
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

const AyamiLoreReveal: React.FC<AyamiLoreRevealProps> = ({ profile }) => {
  // State to manage which section is active: 'lore' (bio/key details) or an attire name
  const [activeTab, setActiveTab] = useState<string>("lore");

  // Combine all core details for easy access
  const fullName = `${profile.firstName} ${profile.lastName}`;
  const japaneseName = `${profile.japaneseFirstName} ${profile.japaneseLastName}`;

  // Find the primary weapon/accessory for the Key Details (used in the 'lore' tab)
  const primaryAttire = profile.attires[0];
  const equipmentAccessory = primaryAttire?.accessories.find(
    (acc) => acc.isWeapon
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

        {/* 2. Attire Tabs (one for each attire) */}
        {profile.attires.map((attire) => (
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
            <h2>{profile.firstName}'s Story</h2>
            {renderBio(profile.bio)}

            <h3 className={styles.keyDetailsTitle}>Key Details</h3>
            <ul className={styles.keyList}>
              <li>
                <b>Full Name:</b> {fullName} ({japaneseName})
              </li>
              <li>
                <b>Vibe:</b> {profile.vibe}
              </li>
              <li>
                <b>Height:</b> {profile.height}
              </li>
              <li>
                <b>Eyes:</b> {profile.eyes}
              </li>
              <li>
                <b>Hair:</b> {profile.hair}
              </li>
              <li>
                <b>Equipment:</b> {profile.primaryEquipment}
              </li>
              {equipmentAccessory && (
                <li>
                  <b>Primary Weapon:</b> {equipmentAccessory.description}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Render Attire Detail when an attire tab is active */}
        {profile.attires.map(
          (attire) =>
            activeTab === attire.name && (
              <div key={attire.name} className={styles.loreSection}>
                <h2>{attire.name} Details</h2>
                <p className={styles.loreParagraph}>{attire.description}</p>

                <h3 className={styles.keyDetailsTitle}>Hairstyle</h3>
                <p className={styles.loreParagraph}>{attire.hairstyle}</p>

                <h3 className={styles.keyDetailsTitle}>Accessories</h3>
                <ul className={styles.keyList}>
                  {attire.accessories.map((acc) => (
                    <li key={acc.ayamiAccessoryId}>
                      <b>{acc.isWeapon ? "Weapon" : "Accessory"}:</b>{" "}
                      {acc.description}
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

export default AyamiLoreReveal;
