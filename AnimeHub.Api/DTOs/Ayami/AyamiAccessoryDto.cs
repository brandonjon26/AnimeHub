namespace AnimeHub.Api.DTOs.Ayami
{
    public record AyamiAccessoryDto(
        int AyamiAccessoryId,
        string Description,
        bool IsWeapon
    );
}
