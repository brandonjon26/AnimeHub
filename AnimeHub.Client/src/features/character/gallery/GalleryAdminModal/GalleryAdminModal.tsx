import React, { useMemo } from "react";
import Modal from "../../../../components/common/modal";
import styles from "./GalleryAdminModal.module.css";
import { useGalleryAdmin } from "../../../../hooks/TS/useGalleryAdmin";
import { type GalleryCategory } from "../../../../api/types/GalleryTypes";
import { GalleryBatchCreateForm } from "./components/GalleryBatchCreateForm";
import { GalleryUpdateDeleteForm } from "./components/GalleryUpdateDeleteForm";

interface GalleryAdminModalProps {
  folders: GalleryCategory[];
  onClose: () => void;
  onGalleryRefresh: () => void;
}

const GalleryAdminModal: React.FC<GalleryAdminModalProps> = (props) => {
  const {
    currentView,
    setCurrentView,
    newCategoryName,
    setNewCategoryName,
    isMatureContent,
    setIsMatureContent,
    selectedFiles,
    featuredIndex,
    setFeaturedIndex,
    handleFileChange,
    handleBatchSubmit,
    selectedFolder,
    setSelectedFolder,
    folderImages,
    updateFeaturedImageId,
    setUpdateFeaturedImageId,
    updateIsMatureContent,
    setUpdateIsMatureContent,
    isLoadingImages,
    handleUpdateFolder,
    handleDeleteFolder,
  } = useGalleryAdmin(props);

  const sortedFolders = useMemo(() => {
    return [...props.folders].sort((a, b) => a.name.localeCompare(b.name));
  }, [props.folders]);

  return (
    <Modal title="Gallery Management Tools" onClose={props.onClose}>
      <div className={styles.controlsWrapper}>
        <div className={styles.viewToggleGroup}>
          <button
            className={
              currentView === "create"
                ? styles.activeButton
                : styles.inactiveButton
            }
            onClick={() => setCurrentView("create")}
          >
            Batch Upload / New Album
          </button>
          <button
            className={
              currentView === "update"
                ? styles.activeButton
                : styles.inactiveButton
            }
            onClick={() => setCurrentView("update")}
          >
            Update Album Metadata / Delete
          </button>
        </div>

        <div className={styles.viewContent}>
          {currentView === "create" && (
            <GalleryBatchCreateForm
              onSubmit={handleBatchSubmit}
              newCategoryName={newCategoryName}
              setNewCategoryName={setNewCategoryName}
              isMatureContent={isMatureContent}
              setIsMatureContent={setIsMatureContent}
              handleFileChange={handleFileChange}
              selectedFiles={selectedFiles}
              featuredIndex={featuredIndex}
              setFeaturedIndex={setFeaturedIndex}
            />
          )}

          {currentView === "update" && (
            <GalleryUpdateDeleteForm
              folders={sortedFolders}
              selectedFolder={selectedFolder}
              setSelectedFolder={setSelectedFolder}
              folderImages={folderImages}
              isLoadingImages={isLoadingImages}
              updateIsMatureContent={updateIsMatureContent}
              setUpdateIsMatureContent={setUpdateIsMatureContent}
              updateFeaturedImageId={updateFeaturedImageId}
              setUpdateFeaturedImageId={setUpdateFeaturedImageId}
              onSubmit={handleUpdateFolder}
              onDelete={handleDeleteFolder}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GalleryAdminModal;
