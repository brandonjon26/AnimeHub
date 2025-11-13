namespace AnimeHub.Api.DTOs.GalleryImage
{
    public record GalleryImageUpdateFolderDto(
    // New status for the entire folder
    bool IsMatureContent,

    // The ID of the image that should now be the featured image for the folder.
    // The service must update all other images in the folder to IsFeatured = false.
    long FeaturedImageId
);
}
