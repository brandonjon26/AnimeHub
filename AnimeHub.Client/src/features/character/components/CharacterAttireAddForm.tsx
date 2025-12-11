import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type CharacterProfileDto,
  type CharacterAttireInput,
  type CharacterAccessoryInput,
} from "../../../api/types/CharacterTypes";
import { CharacterClient } from "../../../api/CharacterClient";
import styles from "../CharacterProfileEditModal.module.css";

interface CharacterAttireAddFormProps {
  profile: CharacterProfileDto;
  profileId: number;
  onSuccess: () => void;
}

// 🔑 Initial state for a new accessory entry
const initialAccessory: CharacterAccessoryInput = {
  description: "",
  isWeapon: false,
};

// 🔑 Initial state for the entire attire form
const initialAttireForm: CharacterAttireInput = {
  name: "",
  attireType: "",
  description: "",
  hairstyleDescription: "",
  accessories: [initialAccessory], // Start with one accessory slot
};

const CharacterAttireAddForm: React.FC<CharacterAttireAddFormProps> = ({
  profile,
  profileId,
  onSuccess,
}) => {
  const [attireData, setAttireData] =
    useState<CharacterAttireInput>(initialAttireForm);
  const queryClient = useQueryClient();

  // Define the consistent route name
  const characterRouteName = profile.firstName.toLowerCase();

  // TanStack Mutation for POST /ayami-profile/attire
  const addAttireMutation = useMutation({
    mutationFn: (data: CharacterAttireInput) =>
      CharacterClient.addAttire(characterRouteName, profileId, data),

    // Optimistic Update Logic
    onMutate: async (newAttireData) => {
      // 1. Cancel any outgoing refetches for the profile to prevent conflict
      await queryClient.cancelQueries({
        queryKey: ["characterProfile", characterRouteName],
      });

      // 2. Snapshot the previous value
      const previousProfile = queryClient.getQueryData<CharacterProfileDto>([
        "characterProfile",
        characterRouteName,
      ]);

      // 3. Optimistically update the cache with the new attire
      if (previousProfile) {
        // NOTE: The backend will generate the characterAttireId, but we need a temp ID for React to track it optimistically.
        const tempId = Math.random();
        const optimisticAttire = {
          ...newAttireData,
          characterAttireId: tempId, // Temporary ID for list rendering
          // Add any other required backend-generated fields with defaults if necessary
        };

        // Create the new profile object with the optimistic attire added
        const newProfile = {
          ...previousProfile,
          attires: [...previousProfile.attires, optimisticAttire],
        };

        // Manually set the new data in the cache
        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          newProfile
        );
      }

      // Return the snapshot to the onError context
      return { previousProfile };
    },

    onSuccess: async (newAttire) => {
      // Reset the form state
      setAttireData(initialAttireForm);
      // Invalidate the cache to force the profile to refetch and update the list
      queryClient.refetchQueries({
        queryKey: ["characterProfile", characterRouteName],
      });

      onSuccess(); // Optional: You might want to keep the modal open but switch tabs, or simply close.
      // For now, we'll let the user manage success feedback.
    },

    onError: (error, newAttire, context) => {
      // Rollback and Error Handling Logic
      console.error("Attire creation failed:", error);

      // 1. Rollback to the previous cached value
      if (context?.previousProfile) {
        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          context.previousProfile
        );
      }

      // 2. Display timed error and trigger a hard refresh
      alert(
        `Failed to add new attire: ${error.message}. Refreshing page in 3 seconds...`
      );
      setTimeout(() => {
        window.location.reload(); // Hard refresh to reset the state
      }, 3000);
    },
  });

  const handleAttireChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAttireData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccessoryChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    const newAccessories = attireData.accessories
      .map((acc, i) => {
        if (i === index) {
          return {
            ...acc,
            [name]: type === "checkbox" ? checked : value,
          };
        }
        return acc;
      })
      .filter(
        (acc, i) =>
          acc.description.trim() !== "" || i < attireData.accessories.length - 1
      ); // Auto-remove empty rows

    setAttireData((prev) => ({
      ...prev,
      accessories: newAccessories,
    }));
  };

  const handleAddAccessory = () => {
    // Only add a new row if the last row is not empty
    const lastAccessory =
      attireData.accessories[attireData.accessories.length - 1];
    if (lastAccessory && lastAccessory.description.trim() !== "") {
      setAttireData((prev) => ({
        ...prev,
        accessories: [...prev.accessories, initialAccessory],
      }));
    }
  };

  const handleRemoveAccessory = (index: number) => {
    // Prevent deleting the last row
    if (attireData.accessories.length > 1) {
      setAttireData((prev) => ({
        ...prev,
        accessories: prev.accessories.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up accessories: filter out any truly empty (description-less) rows before submission
    const accessoriesToSubmit = attireData.accessories.filter(
      (acc) => acc.description.trim() !== ""
    );
    // Ensure accessories array is not empty before submission (backend constraint)

    if (accessoriesToSubmit.length === 0) {
      alert("Attire must have at least one accessory defined.");
      return;
    }

    const dataToSubmit: CharacterAttireInput = {
      ...attireData,
      accessories: accessoriesToSubmit,
    };

    addAttireMutation.mutate(dataToSubmit);
  };

  // Ensure there is always an empty row at the end if the last one has data
  React.useEffect(() => {
    const lastAccessory =
      attireData.accessories[attireData.accessories.length - 1];
    if (lastAccessory && lastAccessory.description.trim() !== "") {
      handleAddAccessory();
    }
  }, [attireData.accessories]);

  const isSubmitting = addAttireMutation.isPending;
  const isAttireValid =
    attireData.name.trim() &&
    attireData.description.trim() &&
    attireData.hairstyleDescription.trim();
  const canSubmit = isAttireValid && !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
      {/* <h3>New Attire Details</h3> */}

      {/* Attire Name */}
      <div className={styles.inputGroup}>
        <label htmlFor="attireName">Attire Name</label>
        <input
          type="text"
          id="attireName"
          name="name"
          value={attireData.name}
          onChange={handleAttireChange}
          required
        />
      </div>

      {/* Hairstyle */}
      <div className={styles.inputGroup}>
        <label htmlFor="hairstyleDescription">Hairstyle</label>
        <input
          type="text"
          id="hairstyleDescription"
          name="hairstyleDescription"
          value={attireData.hairstyleDescription}
          onChange={handleAttireChange}
          required
        />
      </div>

      {/* Attire Type */}
      <div className={styles.inputGroup}>
        <label htmlFor="attireType">Attire Type</label>
        <input
          type="text"
          id="attireType"
          name="attireType"
          value={attireData.attireType}
          onChange={handleAttireChange}
          placeholder="e.g., Secondary, Battle, etc"
          required
        />
      </div>

      {/* Description (Full Width) */}
      <div className={styles.inputGroupFull}>
        <label htmlFor="attireDescription">Description</label>
        <textarea
          id="attireDescription"
          name="description"
          rows={3}
          value={attireData.description}
          onChange={handleAttireChange}
          required
        />
      </div>

      <h3 className={styles.formSectionHeader}>
        Accessories (Weapons & Items)
      </h3>

      {/* 🔑 Accessories List (Full Width) */}
      <div className={styles.inputGroupFull}>
        <div className={styles.accessoryGridHeader}>
          <label>Accessory Description</label>
          <label>Is Weapon?</label>
        </div>

        {attireData.accessories.map((accessory, index) => (
          <div key={index} className={styles.accessoryRow}>
            <input
              type="text"
              name="description"
              value={accessory.description}
              onChange={(e) =>
                handleAccessoryChange(
                  index,
                  e as React.ChangeEvent<HTMLInputElement>
                )
              }
              placeholder="e.g., Witch's Hat, Signature Staff"
              required={index < attireData.accessories.length - 1} // Only require if it's not the auto-added empty row
            />

            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                name="isWeapon"
                checked={accessory.isWeapon}
                onChange={(e) =>
                  handleAccessoryChange(
                    index,
                    e as React.ChangeEvent<HTMLInputElement>
                  )
                }
                className={styles.weaponCheckbox}
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveAccessory(index)}
              className={styles.removeAccessoryButton}
              disabled={
                attireData.accessories.length <= 1 ||
                (index === attireData.accessories.length - 1 &&
                  accessory.description === "")
              }
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className={styles.formFooter}>
        {addAttireMutation.isError && (
          <span className={styles.errorMessage}>
            Error: {addAttireMutation.error.message}
          </span>
        )}
        <button
          type="submit"
          className={styles.saveButton}
          disabled={!canSubmit}
        >
          {isSubmitting ? "Adding..." : "Add New Attire"}
        </button>
      </div>
    </form>
  );
};

export default CharacterAttireAddForm;
