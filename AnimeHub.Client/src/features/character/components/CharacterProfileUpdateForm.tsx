import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"; // 🔑 Import TanStack Query tools
import {
  type CharacterProfileDto,
  type CharacterProfileUpdateInput,
  type LoreEntrySummaryDto,
} from "../../../api/types/CharacterTypes";
import { CharacterClient } from "../../../api/CharacterClient";
import styles from "../CharacterProfileEditModal.module.css"; // Use the modal's styles

interface CharacterProfileUpdateFormProps {
  profile: CharacterProfileDto;
  profileId: number;
  onSuccess: () => void;
}

const CharacterProfileUpdateForm: React.FC<CharacterProfileUpdateFormProps> = ({
  profile,
  profileId,
  onSuccess,
}) => {
  // Fetch all available Lore Entries for the dropdown
  const { data: loreEntries, isLoading: isLoadingLore } = useQuery<
    LoreEntrySummaryDto[]
  >({
    queryKey: ["allLoreEntries"],
    queryFn: () => CharacterClient.getAllLoreEntries(),
  });

  // 🔑 NEW: Safely extract the current Greatest Feat ID from the object
  const initialLoreId = profile.greatestFeat
    ? profile.greatestFeat.loreEntryId
    : 0;

  // State for form inputs, initialized with current profile data
  const [formData, setFormData] = useState<CharacterProfileUpdateInput>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    japaneseFirstName: profile.japaneseFirstName,
    japaneseLastName: profile.japaneseLastName,
    age: profile.age,
    origin: profile.origin || "",
    vibe: profile.vibe,
    height: profile.height,
    bodyType: profile.bodyType,
    hair: profile.hair,
    eyes: profile.eyes,
    skin: profile.skin,
    primaryEquipment: profile.primaryEquipment,
    uniquePower: profile.uniquePower,
    greatestFeatLoreId: initialLoreId || 0,
    magicAptitude: profile.magicAptitude,
    romanticTensionDescription: profile.romanticTensionDescription,
    bio: profile.bio,
  });

  const queryClient = useQueryClient();

  const characterRouteName = profile.firstName.toLowerCase();

  // TanStack Mutation for PUT /ayami-profile
  const updateMutation = useMutation({
    mutationFn: (data: CharacterProfileUpdateInput) =>
      CharacterClient.updateProfile(characterRouteName, profileId, data),
    onSuccess: async () => {
      // Invalidate the cache for the profile to force a refetch and update the UI
      await queryClient.refetchQueries({
        queryKey: ["characterProfile", characterRouteName],
      });

      onSuccess(); // Close the modal
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
      // FUTURE: Implement user-facing error toast/notification here
      alert("Failed to save profile. Check console for details.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle numeric inputs correctly
    let newValue: string | number = value;
    if (type === "number" || name === "greatestFeatLoreId") {
      // Ensure the value is converted to a number, or 0 if empty/invalid
      newValue = parseInt(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger the mutation with the current form data
    updateMutation.mutate(formData);
  }; // mapping it to the input structure for a clean comparison.

  // For the isDirty check, we compare against the original profile data,
  const initialData: CharacterProfileUpdateInput = {
    // Note: We use profile.greatestFeatLoreId which must exist on the DTO now.
    firstName: profile.firstName,
    lastName: profile.lastName,
    japaneseFirstName: profile.japaneseFirstName,
    japaneseLastName: profile.japaneseLastName,
    age: profile.age,
    origin: profile.origin || "",
    vibe: profile.vibe,
    height: profile.height,
    bodyType: profile.bodyType,
    hair: profile.hair,
    eyes: profile.eyes,
    skin: profile.skin,
    primaryEquipment: profile.primaryEquipment,
    uniquePower: profile.uniquePower,
    greatestFeatLoreId: initialLoreId || 0,
    magicAptitude: profile.magicAptitude,
    romanticTensionDescription: profile.romanticTensionDescription,
    bio: profile.bio,
  };

  const isSubmitting = updateMutation.isPending;
  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  // If Lore data is loading, block the form submission/display.
  if (isLoadingLore) {
    return <div className={styles.formLoading}>Loading Lore Entries...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Two-Column Grid for Input Fields */}
      {/* Basic Details */}
      <h2 className={styles.sectionTitle}>Basic Details</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="japaneseFirstName">Japanese First Name</label>
          <input
            type="text"
            id="japaneseFirstName"
            name="japaneseFirstName"
            value={formData.japaneseFirstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="japaneseLastName">Japanese Last Name</label>
          <input
            type="text"
            id="japaneseLastName"
            name="japaneseLastName"
            value={formData.japaneseLastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="origin">Origin</label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin || ""}
            onChange={handleChange}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="vibe">Vibe</label>
          <input
            type="text"
            id="vibe"
            name="vibe"
            value={formData.vibe}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="height">Height</label>
          <input
            type="text"
            id="height"
            name="height"
            value={formData.height}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Appearance Details */}
      <h2 className={styles.sectionTitle}>Appearance</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="bodyType">Body Type</label>
          <input
            type="text"
            id="bodyType"
            name="bodyType"
            value={formData.bodyType}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="hair">Hair</label>
          <input
            type="text"
            id="hair"
            name="hair"
            value={formData.hair}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="eyes">Eyes</label>
          <input
            type="text"
            id="eyes"
            name="eyes"
            value={formData.eyes}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="skin">Skin</label>
          <input
            type="text"
            id="skin"
            name="skin"
            value={formData.skin}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* New Lore/Power Details */}
      <h2 className={styles.sectionTitle}>Abilities & Equipment</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label htmlFor="uniquePower">Unique Power</label>
          <input
            type="text"
            id="uniquePower"
            name="uniquePower"
            value={formData.uniquePower}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="magicAptitude">Magic Aptitude</label>
          <input
            type="text"
            id="magicAptitude"
            name="magicAptitude"
            value={formData.magicAptitude}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="greatestFeatLoreId">Greatest Feat</label>
          <select
            id="greatestFeatLoreId"
            name="greatestFeatLoreId" // Value must be the ID
            value={formData.greatestFeatLoreId} // Handler uses the existing universal handleChange
            onChange={handleChange}
            required
          >
            {/* Option for 'No Feat Selected' (Lore ID 0 is the sentinel value) */}
            <option value={0}>-- None / Select Feat --</option>

            {/* Render options from the fetched data */}
            {loreEntries?.map((entry) => (
              <option key={entry.loreEntryId} value={entry.loreEntryId}>
                {entry.title}
              </option>
            ))}
          </select>
          {/* <input
            type="number"
            id="greatestFeatLoreId"
            name="greatestFeatLoreId"
            value={formData.greatestFeatLoreId}
            onChange={handleChange}
            required
          /> */}
        </div>
        <div className={styles.inputGroupFull}>
          <label htmlFor="primaryEquipment">Primary Equipment</label>
          <input
            type="text"
            id="primaryEquipment"
            name="primaryEquipment"
            value={formData.primaryEquipment}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Romantic Tension is a multiline textarea */}
      <h2 className={styles.sectionTitle}>Lore & Bio</h2>
      <div className={styles.formGrid}>
        <div className={styles.inputGroupFull}>
          <label htmlFor="romanticTensionDescription">Romantic Tension</label>
          <textarea
            id="romanticTensionDescription"
            name="romanticTensionDescription"
            rows={5}
            value={formData.romanticTensionDescription}
            onChange={handleChange}
            required
          />
        </div>
        {/* Bio is a multiline textarea */}
        <div className={styles.inputGroupFull}>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={5}
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className={styles.formFooter}>
        {updateMutation.isError && (
          <span className={styles.errorMessage}>
            Error: {updateMutation.error.message}
          </span>
        )}
        <button
          type="submit"
          className={styles.saveButton}
          disabled={isSubmitting || !isDirty}
        >
          {isSubmitting ? "Saving..." : "Save Profile Changes"}
        </button>
      </div>
    </form>
  );
};

export default CharacterProfileUpdateForm;
