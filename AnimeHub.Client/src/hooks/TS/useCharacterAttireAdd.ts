import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CharacterClient } from "../../api/CharacterClient";
import {
  type CharacterProfileDto,
  type CharacterAttireInput,
  type CharacterAccessoryInput,
} from "../../api/types/CharacterTypes";

const initialAccessory: CharacterAccessoryInput = {
  description: "",
  isWeapon: false,
};

const initialAttireForm: CharacterAttireInput = {
  name: "",
  attireType: "",
  description: "",
  hairstyleDescription: "",
  accessories: [initialAccessory],
};

export const useCharacterAttireAdd = (
  profile: CharacterProfileDto,
  profileId: number,
  onSuccess: () => void
) => {
  const [attireData, setAttireData] =
    useState<CharacterAttireInput>(initialAttireForm);
  const queryClient = useQueryClient();
  const characterRouteName = profile.firstName.toLowerCase();

  const addAttireMutation = useMutation({
    mutationFn: (data: CharacterAttireInput) =>
      CharacterClient.addAttire(characterRouteName, profileId, data),

    onMutate: async (newAttireData) => {
      await queryClient.cancelQueries({
        queryKey: ["characterProfile", characterRouteName],
      });

      const previousProfile = queryClient.getQueryData<CharacterProfileDto>([
        "characterProfile",
        characterRouteName,
      ]);

      if (previousProfile) {
        const tempId = Math.random();
        const optimisticAttire = {
          ...newAttireData,
          characterAttireId: tempId,
        };

        const newProfile = {
          ...previousProfile,
          attires: [...previousProfile.attires, optimisticAttire],
        };

        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          newProfile
        );
      }

      return { previousProfile };
    },

    onSuccess: () => {
      setAttireData(initialAttireForm);
      queryClient.refetchQueries({
        queryKey: ["characterProfile", characterRouteName],
      });
      onSuccess();
    },

    onError: (error: any, _variables, context) => {
      console.error("Attire creation failed:", error);
      if (context?.previousProfile) {
        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          context.previousProfile
        );
      }
      alert(
        `Failed to add new attire: ${error.message}. Refreshing page in 3 seconds...`
      );
      setTimeout(() => window.location.reload(), 3000);
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
          return { ...acc, [name]: type === "checkbox" ? checked : value };
        }
        return acc;
      })
      .filter(
        (acc, i) =>
          acc.description.trim() !== "" || i < attireData.accessories.length - 1
      );

    setAttireData((prev) => ({ ...prev, accessories: newAccessories }));
  };

  const handleAddAccessory = () => {
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
    if (attireData.accessories.length > 1) {
      setAttireData((prev) => ({
        ...prev,
        accessories: prev.accessories.filter((_, i) => i !== index),
      }));
    }
  };

  // Auto-add empty row logic
  useEffect(() => {
    const lastAccessory =
      attireData.accessories[attireData.accessories.length - 1];
    if (lastAccessory && lastAccessory.description.trim() !== "") {
      handleAddAccessory();
    }
  }, [attireData.accessories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const accessoriesToSubmit = attireData.accessories.filter(
      (acc) => acc.description.trim() !== ""
    );

    if (accessoriesToSubmit.length === 0) {
      alert("Attire must have at least one accessory defined.");
      return;
    }

    addAttireMutation.mutate({
      ...attireData,
      accessories: accessoriesToSubmit,
    });
  };

  const canSubmit =
    attireData.name.trim() &&
    attireData.description.trim() &&
    attireData.hairstyleDescription.trim() &&
    !addAttireMutation.isPending;

  return {
    attireData,
    isSubmitting: addAttireMutation.isPending,
    isError: addAttireMutation.isError,
    error: addAttireMutation.error,
    canSubmit,
    handleAttireChange,
    handleAccessoryChange,
    handleRemoveAccessory,
    handleSubmit,
  };
};
