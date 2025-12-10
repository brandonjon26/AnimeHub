import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  type AyamiAttireInput,
  type AyamiAccessoryInput,
} from "../../../api/types/CharacterTypes";
import { AyamiClient } from "../../../api/AyamiClient";
import styles from "../AyamiProfileEditModal.module.css";

interface AyamiAttireAddFormProps {
  profileId: number;
  onSuccess: () => void;
}

// 🔑 Initial state for a new accessory entry
const initialAccessory: AyamiAccessoryInput = {
  description: "",
  isWeapon: false,
};

// 🔑 Initial state for the entire attire form
const initialAttireForm: AyamiAttireInput = {
  name: "",
  description: "",
  hairstyle: "",
  accessories: [initialAccessory], // Start with one accessory slot
};

const AyamiAttireAddForm: React.FC<AyamiAttireAddFormProps> = ({
  profileId,
  onSuccess,
}) => {
  const [attireData, setAttireData] =
    useState<AyamiAttireInput>(initialAttireForm);
  const queryClient = useQueryClient();

  // 🔑 TanStack Mutation for POST /ayami-profile/attire
  const addAttireMutation = useMutation({
    mutationFn: (data: AyamiAttireInput) =>
      AyamiClient.addAttire(profileId, data),
    onSuccess: () => {
      // Reset the form state
      setAttireData(initialAttireForm);
      // Invalidate the cache to force the profile to refetch and update the list
      queryClient.invalidateQueries({ queryKey: ["ayamiProfile"] });
      onSuccess(); // Optional: You might want to keep the modal open but switch tabs, or simply close.
      // For now, we'll let the user manage success feedback.
    },
    onError: (error) => {
      console.error("Attire creation failed:", error);
      alert("Failed to add new attire. Check console for details.");
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

    const dataToSubmit: AyamiAttireInput = {
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
    attireData.hairstyle.trim();
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
        <label htmlFor="hairstyle">Hairstyle</label>
        <input
          type="text"
          id="hairstyle"
          name="hairstyle"
          value={attireData.hairstyle}
          onChange={handleAttireChange}
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

export default AyamiAttireAddForm;
