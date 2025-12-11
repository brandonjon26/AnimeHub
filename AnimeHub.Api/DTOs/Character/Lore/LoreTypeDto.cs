namespace AnimeHub.Api.DTOs.Character.Lore
{
    public record LoreTypeDto(
        int LoreTypeId,
        string Name // e.g., "Quest", "Origin", "Event"
    );
}
