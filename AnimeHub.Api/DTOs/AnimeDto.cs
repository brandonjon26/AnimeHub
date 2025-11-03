namespace AnimeHub.Api.DTOs
{
    // This is the clean data contract exposed by the API
    public record AnimeDto(
        long AnimeId,
        string Title,
        string? Description
        // Note: We deliberately exclude internal fields like DateAdded, 
        // unless the client specifically needs them.
    );
}