import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // 🔑 Import TanStack Query tools
import {
  type AyamiProfileDto,
  type AyamiProfileUpdateInput,
} from "../../../api/types/CharacterTypes";
import { AyamiClient } from "../../../api/AyamiClient";
import styles from "../AyamiProfileEditModal.module.css"; // Use the modal's styles

interface AyamiProfileUpdateFormProps {
  profile: AyamiProfileDto;
  profileId: number;
  onSuccess: () => void;
}

const AyamiProfileUpdateForm: React.FC<AyamiProfileUpdateFormProps> = ({
  profile,
  profileId,
  onSuccess,
}) => {
  // State for form inputs, initialized with current profile data
  const [formData, setFormData] = useState<AyamiProfileUpdateInput>({
    firstName: profile.firstName,
    lastName: profile.lastName,
    japaneseFirstName: profile.japaneseFirstName,
    japaneseLastName: profile.japaneseLastName,
    vibe: profile.vibe,
    height: profile.height,
    bodyType: profile.bodyType,
    hair: profile.hair,
    eyes: profile.eyes,
    skin: profile.skin,
    primaryEquipment: profile.primaryEquipment,
    bio: profile.bio,
  });

  const queryClient = useQueryClient();

  // TanStack Mutation for PUT /ayami-profile
  const updateMutation = useMutation({
    mutationFn: (data: AyamiProfileUpdateInput) =>
      AyamiClient.updateProfile(profileId, data),
    onSuccess: () => {
      // Invalidate the cache for the profile to force a refetch and update the UI
      queryClient.invalidateQueries({ queryKey: ["ayamiProfile"] });
      onSuccess(); // Close the modal
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
      // FUTURE: Implement user-facing error toast/notification here
      alert("Failed to save profile. Check console for details.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger the mutation with the current form data
    updateMutation.mutate(formData);
  };

  const isSubmitting = updateMutation.isPending;
  const isDirty = JSON.stringify(formData) !== JSON.stringify(profile);

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
      {/* Two-Column Grid for Input Fields */}
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

export default AyamiProfileUpdateForm;
