namespace AnimeHub.Api.DTOs.GalleryImage
{
    // DTO for a single gallery image (what the frontend client sees)
    public record GalleryImageDto(
        long GalleryImageId,
        string ImageUrl,
        string AltText,
        bool IsFeatured,
        bool IsMatrureContent,
        string CategoryName // Display name of the category (e.g., "Chibi Style")
    );
}
