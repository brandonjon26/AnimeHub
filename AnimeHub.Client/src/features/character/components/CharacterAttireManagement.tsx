import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

  // 🔑 TanStack Mutation for DELETE /ayami-profile/attire/{attireId}
  const deleteMutation = useMutation({
    mutationFn: (attireId: number) =>
      CharacterClient.deleteAttire(profile.firstName.toLowerCase(), attireId),
    onSuccess: () => {
      // Invalidate the cache to force the profile to refetch and update the attire list
      queryClient.invalidateQueries({
        queryKey: ["characterProfile", profileId],
      });
      // 🔑 FUTURE: Implement user feedback (e.g., toast message)
    },
    onError: (error) => {
      console.error("Attire deletion failed:", error);
      alert("Failed to delete attire. Check console for details.");
    },
  });

  const handleDelete = (attireId: number, attireName: string) => {
    if (profile.attires.length === 1) {
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
          disabled={deleteMutation.isPending || profile.attires.length === 1}
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
        {profile.attires.length > 0 ? (
          profile.attires.map(renderAttireCard)
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
