import React from "react";
import { type CharacterProfileDto } from "../../../../../api/types/CharacterTypes";
import { useCharacterProfileForm } from "../../../../../hooks/TS/useCharacterProfileForm";
import styles from "../../../CharacterProfileEditModal.module.css";

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
  const {
    formData,
    loreEntries,
    isLoadingLore,
    isSubmitting,
    isError,
    error,
    isDirty,
    handleChange,
    handleSubmit,
  } = useCharacterProfileForm(profile, profileId, onSuccess);

  if (isLoadingLore) {
    return <div className={styles.formLoading}>Loading Lore Entries...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
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
            name="greatestFeatLoreId"
            value={formData.greatestFeatLoreId}
            onChange={handleChange}
            required
          >
            <option value={0}>-- None / Select Feat --</option>
            {loreEntries?.map((entry) => (
              <option key={entry.loreEntryId} value={entry.loreEntryId}>
                {entry.title}
              </option>
            ))}
          </select>
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
        {isError && (
          <span className={styles.errorMessage}>
            Error: {(error as Error).message}
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
