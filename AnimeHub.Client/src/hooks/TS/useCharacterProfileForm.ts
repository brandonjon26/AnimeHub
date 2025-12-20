import { useState, useMemo } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CharacterClient } from "../../api/CharacterClient";
import {
  type CharacterProfileDto,
  type CharacterProfileUpdateInput,
  type LoreEntrySummaryDto,
} from "../../api/types/CharacterTypes";
import { mapProfileToUpdateInput } from "../../utils/TS/characterMappingUtils";

export const useCharacterProfileForm = (
  profile: CharacterProfileDto,
  profileId: number,
  onSuccess: () => void
) => {
  const queryClient = useQueryClient();
  const characterRouteName = profile.firstName.toLowerCase();

  // 1. Fetch Lore Entries
  const { data: loreEntries, isLoading: isLoadingLore } = useQuery<
    LoreEntrySummaryDto[]
  >({
    queryKey: ["allLoreEntries"],
    queryFn: () => CharacterClient.getAllLoreEntries(),
  });

  // 2. Form State Management
  const initialData = useMemo(
    () => mapProfileToUpdateInput(profile),
    [profile]
  );
  const [formData, setFormData] =
    useState<CharacterProfileUpdateInput>(initialData);

  // 3. Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: CharacterProfileUpdateInput) =>
      CharacterClient.updateProfile(characterRouteName, profileId, data),
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ["characterProfile", characterRouteName],
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Profile update failed:", error);
      alert("Failed to save profile. Check console for details.");
    },
  });

  // 4. Handlers
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number = value;

    if (type === "number" || name === "greatestFeatLoreId") {
      newValue = parseInt(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  return {
    formData,
    loreEntries,
    isLoadingLore,
    isSubmitting: updateMutation.isPending,
    isError: updateMutation.isError,
    error: updateMutation.error,
    isDirty,
    handleChange,
    handleSubmit,
  };
};
