import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  type GalleryImage,
  type GalleryCategory,
} from "../../api/types/GalleryTypes";
import { type AyamiProfileDto } from "../../api/types/AyamiTypes";
import AyamiProfileEditModal from "./AyamiProfileEditModal";
import { useAuth } from "../../hooks/useAuth";
import GalleryAdminModal from "./gallery/GalleryAdminModal";
import styles from "./AboutAyamiPage.module.css";

interface AyamiContentProps {
  profile: AyamiProfileDto;
  featuredImages: GalleryImage[];
  folders: GalleryCategory[];
  isAdult: boolean;
  onGalleryRefresh: () => void;
}

const renderBio = (text: string) => {
  return text.split("\n\n").map((paragraph, index) => (
    <p
      key={index}
      className={styles.paragraph}
      dangerouslySetInnerHTML={{
        __html: paragraph
          .trim()
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
      }}
    />
  ));
};

const AyamiContent: React.FC<AyamiContentProps> = ({
  profile,
  featuredImages,
  folders,
  isAdult,
  onGalleryRefresh,
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isGalleryAdminModalOpen, setIsGalleryAdminModalOpen] = useState(false);

  // Audio management
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get user role for authorization
  const { user } = useAuth();
  // Check if the user is an Admin or Moderator (assuming roles are 'Admin' or 'Moderator')
  const isAdminAccess = user?.roles[0] === "Admin" || user?.roles[0] === "Mage";

  const profileId = profile.ayamiProfileId;

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const japaneseName = `${profile.japaneseFirstName} ${profile.japaneseLastName}`;

  // Get accessories from the first attire for the Key Details list
  // Note: In a larger app, you might choose a primary attire specifically.
  const primaryAttire = profile.attires[0];
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
        {profile.greetingAudioUrl && (
          <button
            className={styles.audioButton}
            onClick={handlePlayGreeting}
            aria-label={
              isPlaying ? "Pause Ayami's greeting" : "Play Ayami's greeting"
            }
          >
            {/* Simple icon logic: use a speaker icon or play/pause symbols */}
            {isPlaying ? "🔈" : "🔊"}
          </button>
        )}
      </h1>

      {/* Hidden Audio Element (Loaded via URL from DTO) */}
      {profile.greetingAudioUrl && (
        <audio ref={audioRef} src={profile.greetingAudioUrl} preload="auto" />
      )}

      {/* Reuses the existing flex wrapper class */}
      <div className={styles.contentWrapper}>
        {/* LEFT: Bio/Text Area (Retaining original structure) */}
        <div className={styles.bioArea}>
          <div className={styles.bioFlexContainer}>
            {/* Static image remains for the bio section */}
            <div
              className={`${styles.headshotContainer} ${
                !isAdminAccess ? styles.headshotContainerDisabled : ""
              }`}
              onClick={() => isAdminAccess && setIsProfileModalOpen(true)}
            >
              <img
                src="/images/ayami/Ayami_Bio_Page_3.png"
                alt={`${fullName} Headshot`}
                className={styles.headshotImage}
              />

              {isAdminAccess && (
                <span className={styles.editOverlay}>Edit Profile</span>
              )}
            </div>

            <div className={styles.bioText}>
              <h2>{profile.firstName}'s Story</h2>
              {renderBio(profile.bio)}
            </div>
          </div>
          {/* Key Details List remains static */}
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
              <li>**Primary Weapon:** {equipmentAccessory.description}</li>
            )}
          </ul>
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
          <h2>{profile.firstName}'s Albums</h2>

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
      {isProfileModalOpen && (
        <AyamiProfileEditModal
          profile={profile}
          profileId={profileId}
          onClose={() => setIsProfileModalOpen(false)}
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

export default AyamiContent;
