namespace AnimeHub.Api.DTOs.GalleryImage
{
    public record GalleryImageCreateSingleDto(
    // The ID of the existing category/folder to add the image to
    int CategoryId,

    // Metadata for the new image
    string ImageUrl,
    string AltText,
    bool IsFeatured, // Option to set the new image as the featured image (requires updating the old featured image)
    bool IsMature
);
}
