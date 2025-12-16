import { useState } from "react";
import { type CharacterProfileDto } from "../../api/types/CharacterTypes";

/**
 * Custom hook to manage the state and handlers for a universal character profile edit modal.
 * It manages which profile is being edited and handles the success/remount logic.
 *
 * @returns An object containing state and handlers.
 */
export const useProfileEditModal = (isAdminAccess: boolean) => {
  // Tracks which character is being edited. Null means modal is closed.
  const [editingProfile, setEditingProfile] =
    useState<CharacterProfileDto | null>(null);

  // Used to force re-mount of the modal after a successful mutation
  const [profileModalKey, setProfileModalKey] = useState(0);

  /**
   * Sets the profile to be edited, opening the modal.
   * @param profile The profile DTO to begin editing.
   */
  const handleEditClick = (profile: CharacterProfileDto) => {
    if (isAdminAccess) {
      setEditingProfile(profile);
    } else {
      console.warn("Attempted to edit profile without admin access.");
    }
  };

  /**
   * Called on mutation success (save/update). Closes modal and forces remount
   * to pick up fresh data from the parent's query.
   */
  const handleMutationSuccess = () => {
    setEditingProfile(null);
    setProfileModalKey((prev) => prev + 1);
  };

  return {
    editingProfile,
    profileModalKey,
    handleEditClick,
    handleMutationSuccess,
    handleCloseModal: () => setEditingProfile(null), // Simple close handler
  };
};
