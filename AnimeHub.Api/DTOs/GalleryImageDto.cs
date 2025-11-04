namespace AnimeHub.Api.DTOs
{
    // DTO for a single gallery image (what the frontend client sees)
    public record GalleryImageDto(
        long GalleryImageId,
        string ImageUrl,
        string AltText,
        bool IsFeatured,
        string CategoryName // Display name of the category (e.g., "Chibi Style")
    );
}
