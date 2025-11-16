namespace AnimeHub.Api.DTOs.GalleryImage
{
    // DTO for updating an existing gallery image record.
    // The client will send this to the [HttpPut] endpoint.
    public record GalleryImageUpdateDto(
        // These fields are necessary for the admin to manage image metadata
        string AltText,
        bool IsFeatured,
        bool IsMatureContent
    // We omit GalleryImageId here as it will typically be passed in the URL path.
    // We omit ImageUrl as changing the image file itself is typically a separate operation.
    );
}
