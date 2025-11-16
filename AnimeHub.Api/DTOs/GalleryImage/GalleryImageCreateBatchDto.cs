namespace AnimeHub.Api.DTOs.GalleryImage
{
    public record GalleryImageCreateBatchDto(
    // Metadata for the new category/folder
    int CategoryId,
    bool IsMatureContent,

    // The list of new images to be added to this category
    List<ImageMetadataDto> Images
    );

    // Helper record for image file information (assuming file upload is handled separately or by URL)
    public record ImageMetadataDto(
        string ImageUrl,
        string AltText,
        bool IsFeatured // Only one image in the batch should have this set to true
    );
}
