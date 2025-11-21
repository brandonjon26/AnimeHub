namespace AnimeHub.Api.DTOs.GalleryImage
{
    public record GalleryImageUpdateSingleDto(
        // The ID of the category/folder the image should be moved to.
        int NewGalleryImageCategoryId,

        // The new maturity status for this specific image.
        bool IsMatureContent
    );
}