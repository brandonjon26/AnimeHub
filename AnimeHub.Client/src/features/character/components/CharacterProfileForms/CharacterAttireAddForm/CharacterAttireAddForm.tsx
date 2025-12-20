import React from "react";
import { type CharacterProfileDto } from "../../../../../api/types/CharacterTypes";
import { useCharacterAttireAdd } from "../../../../../hooks/TS/useCharacterAttireAdd";
import styles from "./CharacterAttireAddForm.module.css";

interface CharacterAttireAddFormProps {
  profile: CharacterProfileDto;
  profileId: number;
  onSuccess: () => void;
}

const CharacterAttireAddForm: React.FC<CharacterAttireAddFormProps> = ({
  profile,
  profileId,
  onSuccess,
}) => {
  const {
    attireData,
    isSubmitting,
    isError,
    error,
    canSubmit,
    handleAttireChange,
    handleAccessoryChange,
    handleRemoveAccessory,
    handleSubmit,
  } = useCharacterAttireAdd(profile, profileId, onSuccess);

  return (
    <form onSubmit={handleSubmit} className={styles.formGrid}>
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
              onChange={(e) => handleAccessoryChange(index, e)}
              placeholder="e.g., Witch's Hat, Signature Staff"
              required={index < attireData.accessories.length - 1}
            />

            <div className={styles.checkboxWrapper}>
              <input
                type="checkbox"
                name="isWeapon"
                checked={accessory.isWeapon}
                onChange={(e) => handleAccessoryChange(index, e)}
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
        {isError && (
          <span className={styles.errorMessage}>
            Error: {(error as Error).message}
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
