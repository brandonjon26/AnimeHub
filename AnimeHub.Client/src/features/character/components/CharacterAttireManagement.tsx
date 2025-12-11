import React from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  type CharacterProfileDto,
  type CharacterAttireDto,
} from "../../../api/types/CharacterTypes";
import { CharacterClient } from "../../../api/CharacterClient";
import CharacterAttireAddForm from "./CharacterAttireAddForm";
import styles from "../CharacterProfileEditModal.module.css";

interface CharacterAttireManagementProps {
  profile: CharacterProfileDto;
  profileId: number;
}

const CharacterAttireManagement: React.FC<CharacterAttireManagementProps> = ({
  profile,
  profileId,
}) => {
  const queryClient = useQueryClient();

  // Get the profile *data* directly from the cache
  const fullProfile = queryClient.getQueryData<CharacterProfileDto>(
    ["characterProfile", profile.firstName.toLowerCase()] // **This requires the stale prop for the key!**
  );

  // Define the consistent route name
  const characterRouteName = profile.firstName.toLowerCase();

  const { data: liveProfile, isPending: isProfileLoading } = useQuery({
    queryKey: ["characterProfile", characterRouteName],
    // We don't need a queryFn because the data is already in the cache from the parent page's useQueries.
    // This useQuery hook simply subscribes this component to that existing cache entry.
    // We will only call the function if data is missing (not expected here)
    queryFn: () => CharacterClient.getProfile(characterRouteName),
    enabled: !!characterRouteName,
    // StaleTime of Infinity ensures it doesn't refetch until manually told (via mutation)
    staleTime: Infinity,
  });

  // Use the liveProfile data instead of the prop
  const profileToRender = liveProfile ?? profile; // Fallback to prop if cache is somehow empty

  // 🔑 TanStack Mutation for DELETE /ayami-profile/attire/{attireId}
  const deleteMutation = useMutation({
    mutationFn: (attireId: number) =>
      CharacterClient.deleteAttire(characterRouteName, attireId),

    // 🔑 NEW: Optimistic Deletion Logic
    onMutate: async (attireIdToDelete) => {
      // 1. Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["characterProfile", characterRouteName],
      });

      // 2. Snapshot the previous profile value
      const previousProfile = queryClient.getQueryData<CharacterProfileDto>([
        "characterProfile",
        characterRouteName,
      ]);

      // 3. Optimistically remove the attire from the cache
      if (previousProfile) {
        const newAttires = previousProfile.attires.filter(
          (attire) => attire.characterAttireId !== attireIdToDelete
        );

        const newProfile = {
          ...previousProfile,
          attires: newAttires,
        };

        // Manually set the new data in the cache, instantly removing the attire
        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          newProfile
        );
      }

      // Return the snapshot for use in onError
      return { previousProfile };
    },

    onSuccess: () => {
      // Invalidate the cache to force the profile to refetch and update the attire list
      queryClient.refetchQueries({
        queryKey: ["characterProfile", characterRouteName],
      });
      // 🔑 FUTURE: Implement user feedback (e.g., toast message)
    },

    onError: (error, attireIdToDelete, context) => {
      console.error("Attire deletion failed:", error);

      // Rollback to the previous cached value
      if (context?.previousProfile) {
        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          context.previousProfile
        );
      }

      // Implement robust error handling (will re-add the deleted attire)
      alert(`Failed to delete attire: ${error.message}. Attire restored.`);
    },
  });

  const handleDelete = (attireId: number, attireName: string) => {
    if (profileToRender.attires.length === 1) {
      alert("You must always keep at least one attire for Ayami's profile.");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete the attire: "${attireName}"?`
      )
    ) {
      deleteMutation.mutate(attireId);
    }
  };

  const renderAttireCard = (attire: CharacterAttireDto) => (
    <div key={attire.characterAttireId} className={styles.attireCard}>
      <div className={styles.attireHeader}>
        <h4 className={styles.attireTitle}>{attire.name}</h4>
        <button
          onClick={() => handleDelete(attire.characterAttireId, attire.name)}
          className={styles.deleteButton}
          disabled={
            deleteMutation.isPending || profileToRender.attires.length === 1
          }
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete Attire"}
        </button>
      </div>

      <p className={styles.attireDescription}>{attire.description}</p>
      <p className={styles.attireHairstyle}>
        Hairstyle: {attire.hairstyleDescription}
      </p>

      <h5 className={styles.accessoryTitle}>
        Accessories ({attire.accessories.length})
      </h5>
      <ul className={styles.accessoryList}>
        {attire.accessories.map((acc) => (
          <li key={acc.characterAccessoryId}>
            {acc.description}{" "}
            {acc.isWeapon && <span className={styles.weaponTag}>(Weapon)</span>}
          </li>
        ))}
      </ul>
    </div>
  );

  // Function to scroll up after adding an attire to see the new entry
  const handleAttireAdded = () => {
    // Invalidate cache is handled in the form's onSuccess.
    // We can optionally switch back to the Attire List view if we had separate sections.
    // Since we are on the Attire Management tab, we just let the profile refetch.
  };

  return (
    <div>
      {/* 1. Attire List (Read/Delete) */}
      <h3>Current Attires</h3>
      <div className={styles.attireListContainer}>
        {profileToRender.attires.length > 0 ? (
          profileToRender.attires.map(renderAttireCard)
        ) : (
          <p>No attires found.</p>
        )}
      </div>

      <hr className={styles.divider} />

      {/* 2. Add New Attire (Create) */}
      <h3>Add New Attire</h3>
      <br />
      <CharacterAttireAddForm
        profile={profile}
        profileId={profile.characterProfileId}
        onSuccess={handleAttireAdded}
      />
    </div>
  );
};

export default CharacterAttireManagement;
