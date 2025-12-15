import React, { useState } from "react";
import { GalleryAdminModal } from "../GalleryAdminModal";
import { type GalleryCategory } from "../../../../api/types/GalleryTypes";
import styles from "./CharacterGalleryAdminTools.module.css";

interface CharacterGalleryAdminToolsProps {
  isAdminAccess: boolean;
  folders: GalleryCategory[];
  onGalleryRefresh: () => void;
}

const CharacterGalleryAdminTools: React.FC<CharacterGalleryAdminToolsProps> = ({
  isAdminAccess,
  folders,
  onGalleryRefresh,
}) => {
  const [isGalleryAdminModalOpen, setIsGalleryAdminModalOpen] = useState(false);

  if (!isAdminAccess) {
    return null; // Don't render anything if the user is not an Admin/Mage
  }

  const handleOpen = () => setIsGalleryAdminModalOpen(true);
  const handleClose = () => setIsGalleryAdminModalOpen(false);

  return (
    <>
      {/* Admin Button */}
      <div className={styles.adminQuickAccess}>
        <button className={styles.adminButton} onClick={handleOpen}>
          🖼️ Manage Gallery Albums
        </button>
      </div>

      {/* Modal Rendering */}
      {isGalleryAdminModalOpen && (
        <GalleryAdminModal
          folders={folders}
          onClose={handleClose}
          onGalleryRefresh={onGalleryRefresh}
        />
      )}
    </>
  );
};

export default CharacterGalleryAdminTools;
