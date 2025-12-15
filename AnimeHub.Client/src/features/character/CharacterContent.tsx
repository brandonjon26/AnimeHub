import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import { type CharacterProfileDto } from "../../api/types/CharacterTypes";
import { CharacterGreetingTitle } from "./components/CharacterGreetingTitle";
import CharacterLoreReveal from "./CharacterLoreReveal";
import CharacterProfileEditModal from "./CharacterProfileEditModal";
import { EditableHeadshot } from "./components/EditableHeadshot";
import { CharacterGalleryAdminTools } from "./gallery/CharacterGalleryAdminTools";
import { useAuth } from "../../hooks/useAuth";
import { useProfileEditModal } from "../../hooks/useProfileEditModal";
import styles from "./AboutCharacterPage.module.css";

interface CharacterContentProps {
  primaryProfile: CharacterProfileDto;
  secondaryProfile: CharacterProfileDto | undefined;
  featuredImages: GalleryImage[];
  folders: GalleryCategory[];
  isAdult: boolean;
  onGalleryRefresh: () => void;
}

const CharacterContent: React.FC<CharacterContentProps> = ({
  primaryProfile,
  secondaryProfile,
  featuredImages,
  folders,
  isAdult,
  onGalleryRefresh,
}) => {
  // Get user role for authorization
  const { user } = useAuth();
  // Check if the user is an Admin or Moderator (assuming roles are 'Admin' or 'Moderator')
  const isAdminAccess = user?.roles[0] === "Admin" || user?.roles[0] === "Mage";

  // Use the Custom Hook for Edit Modal Logic
  const {
    editingProfile,
    profileModalKey,
    handleEditClick,
    handleMutationSuccess,
  } = useProfileEditModal(isAdminAccess);

  const profileId = primaryProfile.characterProfileId;
  const fullName = `${primaryProfile.firstName} ${primaryProfile.lastName}`;
  const japaneseName = `${primaryProfile.japaneseFirstName} ${primaryProfile.japaneseLastName}`;
  const firstName = primaryProfile.firstName;

  // const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // const [isGalleryAdminModalOpen, setIsGalleryAdminModalOpen] = useState(false);

  // Get accessories from the first attire for the Key Details list
  // Note: In a larger app, you might choose a primary attire specifically.
  const primaryAttire = primaryProfile.attires[0];
  const equipmentAccessory = primaryAttire?.accessories.find(
    (acc) => acc.isWeapon
  );

  // Filter the folders based on user's isAdult status
  const filteredFolders = folders.filter((folder) => {
    // If the folder is NOT mature, always show it.
    if (!folder.isMatureContent) {
      return true;
    }
    // If the folder IS mature, only show it if the user is an adult.
    return isAdult;
  });

  return (
    <>
      {/* 1. TOP SECTION: Bio (Left) and Featured Photos (Right) */}
      <CharacterGreetingTitle // 🔑 USE NEW COMPONENT
        fullName={fullName}
        japaneseName={japaneseName}
        greetingAudioUrl={primaryProfile.greetingAudioUrl}
        firstName={firstName}
      />

      {/* Reuses the existing flex wrapper class */}
      <div className={styles.contentWrapper}>
        {/* LEFT: Bio/Text Area (Retaining original structure) */}
        <div className={styles.bioArea}>
          <div className={styles.bioFlexContainer}>
            {/* Primary Character Headshot (Ayami) */}
            <EditableHeadshot
              profile={primaryProfile}
              isAdminAccess={isAdminAccess}
              onEditClick={handleEditClick} // Pass the handler
              size="primary" // Use the larger, default size
            />

            <CharacterLoreReveal
              primaryProfile={primaryProfile}
              secondaryProfile={secondaryProfile}
              onEditClick={handleEditClick}
              isAdminAccess={isAdminAccess}
            />
          </div>
        </div>

        {/* RIGHT: Featured Photos Gallery (Replaces static content) */}
        {/* Reuses the existing galleryArea class */}
        <div className={styles.galleryArea}>
          <h2>Featured Photos</h2>

          {/* Grid for two featured images */}
          <div className={styles.featuredGrid}>
            {featuredImages.map((img) => (
              <img
                key={img.galleryImageId}
                src={img.imageUrl}
                alt={img.altText}
                className={styles.featuredImage}
              />
            ))}
            {featuredImages.length === 0 && <p>Loading featured images...</p>}
          </div>
        </div>
      </div>

      {/* 2. BOTTOM SECTION: Album/Folder Links */}
      <div className={styles.albumsSection}>
        <div className={styles.galleryHeader}>
          <h2>{primaryProfile.firstName}'s Albums</h2>

          {/* ADMIN QUICK-ACCESS TOOLS */}
          <CharacterGalleryAdminTools
            isAdminAccess={isAdminAccess}
            folders={folders}
            onGalleryRefresh={onGalleryRefresh}
          />
        </div>
        <div className={styles.albumList}>
          {filteredFolders.map((folder) => (
            <Link
              key={folder.galleryImageCategoryId}
              to={folder.name} // Target the nested route for Step 5
              className={styles.albumLink}
            >
              <div className={styles.albumCard}>
                <img
                  src={folder.coverUrl}
                  alt={`Cover image for ${folder.name} album`}
                  className={styles.albumCover}
                />
                <h4>{folder.name}</h4>
                {folder.isMatureContent && ( // Indicate mature content
                  <span className={styles.matureTag}>🔞 Mature</span>
                )}
              </div>
            </Link>
          ))}
        </div>
        {filteredFolders.length === 0 && folders.length > 0 && !isAdult && (
          <p>
            Some albums are hidden because they contain mature content. Please
            verify your age by logging in or updating your profile.
          </p>
        )}
      </div>

      {/* MODAL RENDERING */}
      {editingProfile && (
        <CharacterProfileEditModal
          key={profileModalKey}
          profile={editingProfile}
          profileId={editingProfile.characterProfileId}
          onClose={handleMutationSuccess}
        />
      )}
    </>
  );
};

export default CharacterContent;
