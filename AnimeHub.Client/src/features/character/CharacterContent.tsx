import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import {
  type CharacterProfileDto,
  type CharacterProfileSummaryDto,
} from "../../api/types/CharacterTypes";
import CharacterLoreReveal from "./CharacterLoreReveal";
import CharacterProfileEditModal from "./CharacterProfileEditModal";
import { EditableHeadshot } from "./components/EditableHeadshot";
import { useAuth } from "../../hooks/useAuth";
import GalleryAdminModal from "./gallery/GalleryAdminModal";
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
  // Tracks which character is being edited. Null means modal is closed.
  const [editingProfile, setEditingProfile] =
    useState<CharacterProfileDto | null>(null);

  // Used to force re-mount of the modal after a successful mutation
  const [profileModalKey, setProfileModalKey] = useState(0);

  // const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGalleryAdminModalOpen, setIsGalleryAdminModalOpen] = useState(false);

  // Audio management
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get user role for authorization
  const { user } = useAuth();
  // Check if the user is an Admin or Moderator (assuming roles are 'Admin' or 'Moderator')
  const isAdminAccess = user?.roles[0] === "Admin" || user?.roles[0] === "Mage";

  const profileId = primaryProfile.characterProfileId;

  const fullName = `${primaryProfile.firstName} ${primaryProfile.lastName}`;
  const japaneseName = `${primaryProfile.japaneseFirstName} ${primaryProfile.japaneseLastName}`;

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

  // --- Universal Profile Edit Handler ---
  const handleEditClick = (profile: CharacterProfileDto) => {
    if (isAdminAccess) {
      setEditingProfile(profile);
    }
  };

  // --- Universal Modal Close/Mutation Success Handler ---
  const handleMutationSuccess = () => {
    setEditingProfile(null); // Close modal by resetting the editing profile state

    // Increment the key to force the modal to re-mount/re-initialize.
    // This is crucial because the primaryProfile prop, which holds the stale attire list,
    // will now be freshly re-read from the parent's useQuery cache on the next render.
    setProfileModalKey((prev) => prev + 1);
  };
  // --- END Modal Handlers ---

  // Play/Pause Audio
  const handlePlayGreeting = () => {
    if (!audioRef.current) return;

    // If currently paused, play it
    if (audioRef.current.paused) {
      // Always reset to start before playing if it's not the first time
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        // Catch promise rejection (e.g., if user hasn't interacted with the page yet)
        console.error("Audio playback failed:", error);
      });
      setIsPlaying(true);
    } else {
      // If currently playing, pause it and reset
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  // Reset playback state when audio finishes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const handleEnded = () => setIsPlaying(false);
      audio.addEventListener("ended", handleEnded);
      return () => {
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, []);

  return (
    <>
      {/* 1. TOP SECTION: Bio (Left) and Featured Photos (Right) */}
      <h1 className={styles.title}>
        Meet {fullName} ({japaneseName}) 🔮 The Bewitching Beauty {/*🌟*/}
        {/* Play Button */}
        {primaryProfile.greetingAudioUrl && (
          <button
            className={styles.audioButton}
            onClick={handlePlayGreeting}
            aria-label={
              isPlaying
                ? `Pause ${primaryProfile.firstName}'s greeting`
                : `Play ${primaryProfile.firstName}'s greeting`
            }
          >
            {/* Simple icon logic: use a speaker icon or play/pause symbols */}
            {isPlaying ? "🔈" : "🔊"}
          </button>
        )}
      </h1>

      {/* Hidden Audio Element (Loaded via URL from DTO) */}
      {primaryProfile.greetingAudioUrl && (
        <audio
          ref={audioRef}
          src={primaryProfile.greetingAudioUrl}
          preload="auto"
        />
      )}

      {/* Reuses the existing flex wrapper class */}
      <div className={styles.contentWrapper}>
        {/* LEFT: Bio/Text Area (Retaining original structure) */}
        <div className={styles.bioArea}>
          <div className={styles.bioFlexContainer}>
            {/* 🔑 REPLACED: Primary Character Headshot (Ayami) */}
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

          {/* 🔑 ADMIN QUICK-ACCESS TOOLS */}
          {isAdminAccess && (
            <div className={styles.adminQuickAccess}>
              <button
                className={styles.adminButton}
                onClick={() => setIsGalleryAdminModalOpen(true)}
              >
                🖼️ Manage Gallery Albums
              </button>
            </div>
          )}
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

      {/* 🔑 NEW: GALLERY ADMIN MODAL */}
      {isGalleryAdminModalOpen && (
        <GalleryAdminModal
          folders={folders}
          onClose={() => setIsGalleryAdminModalOpen(false)}
          onGalleryRefresh={onGalleryRefresh}
        />
      )}
    </>
  );
};

export default CharacterContent;
