namespace AnimeHub.Api.DTOs.Character
{
    public record CharacterAccessoryDto(
        int CharacterAccessoryId,
        string Description,
        bool IsWeapon,
        string? UniqueEffect
    );
}
