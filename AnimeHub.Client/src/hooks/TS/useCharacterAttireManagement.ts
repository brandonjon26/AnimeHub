import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { CharacterClient } from "../../api/CharacterClient";
import { type CharacterProfileDto } from "../../api/types/CharacterTypes";

export const useCharacterAttireManagement = (profile: CharacterProfileDto) => {
  const queryClient = useQueryClient();
  const characterRouteName = profile.firstName.toLowerCase();

  // Subscribe to the cache to get the "live" profile data
  const { data: liveProfile } = useQuery({
    queryKey: ["characterProfile", characterRouteName],
    queryFn: () => CharacterClient.getProfile(characterRouteName),
    enabled: !!characterRouteName,
    staleTime: Infinity,
  });

  const profileToRender = liveProfile ?? profile;

  const deleteMutation = useMutation({
    mutationFn: (attireId: number) =>
      CharacterClient.deleteAttire(characterRouteName, attireId),

    onMutate: async (attireIdToDelete) => {
      await queryClient.cancelQueries({
        queryKey: ["characterProfile", characterRouteName],
      });

      const previousProfile = queryClient.getQueryData<CharacterProfileDto>([
        "characterProfile",
        characterRouteName,
      ]);

      if (previousProfile) {
        const newProfile = {
          ...previousProfile,
          attires: previousProfile.attires.filter(
            (attire) => attire.characterAttireId !== attireIdToDelete
          ),
        };

        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          newProfile
        );
      }

      return { previousProfile };
    },

    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["characterProfile", characterRouteName],
      });
    },

    onError: (error: any, _variables, context) => {
      console.error("Attire deletion failed:", error);
      if (context?.previousProfile) {
        queryClient.setQueryData(
          ["characterProfile", characterRouteName],
          context.previousProfile
        );
      }
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

  return {
    profileToRender,
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};
