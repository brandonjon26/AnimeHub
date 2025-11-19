using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnimeHub.Api.DTOs.GalleryImage
{
    /**
     * DTO used *exclusively* by the GalleryEndpoints Minimal API action 
     * to bind multipart/form-data. This DTO separates the JSON metadata 
     * from the IFormFile array, which is necessary for complex uploads.
     */
    public record GalleryImageBatchUploadRequest(
        [FromForm] string Metadata, // JSON string containing GalleryImageCreateBatchDto content
        [FromForm] IFormFile[] Files
    );
}
