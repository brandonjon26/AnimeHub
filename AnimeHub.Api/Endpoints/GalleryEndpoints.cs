using AnimeHub.Api.DTOs.GalleryImage;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Routing;

namespace AnimeHub.Api.Endpoints
{
    public static class GalleryEndpoints
    {
        public static void MapGalleryEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/gallery")
                .WithTags("Gallery")
                .AllowAnonymous(); // Explicitly allows public read access for all current GETs

            // ---------------------------------------------------------------------
            // Endpoint 1: GET /api/gallery/featured (Get the two featured photos)
            // ---------------------------------------------------------------------
            group.MapGet("/featured", async (GalleryInterface galleryService) =>
            {
                var featured = await galleryService.GetFeaturedImagesAsync();
                return Results.Ok(featured);
            })
            .WithName("GetFeaturedImages")
            .WithOpenApi();

            // -----------------------------------------------------------------------
            // Endpoint 2: GET /api/gallery/folders (Get the album metadata for links)
            // -----------------------------------------------------------------------
            group.MapGet("/folders", async (GalleryInterface galleryService) =>
            {
                var folders = await galleryService.GetAllCategoriesAsync();
                return Results.Ok(folders);
            })
            .WithName("GetGalleryFolders")
            .WithOpenApi();

            // -------------------------------------------------------------------------
            // Endpoint 3: GET /api/gallery/{categoryName} (Get all photos for an album)
            // -------------------------------------------------------------------------
            group.MapGet("/{categoryName}", async (string categoryName, GalleryInterface galleryService) =>
            {
                var images = await galleryService.GetImagesByCategoryNameAsync(categoryName);
                if (!images.Any())
                {
                    return Results.NotFound($"Category '{categoryName}' not found or empty.");
                }
                return Results.Ok(images);
            })
            .WithName("GetImagesByCategory")
            .WithOpenApi();

            // ----------------------------------------------------------------------------
            // Endpoint 4: POST /api/gallery/batch (Create New Folder/Category with images)
            // ----------------------------------------------------------------------------
            group.MapPost("/batch", async (GalleryImageCreateBatchDto dto, GalleryInterface galleryService) =>
            {
                var success = await galleryService.CreateImageBatchAsync(dto);
                return success ? Results.Created($"/api/gallery/{dto.CategoryId}", dto) : Results.BadRequest("Failed to create gallery batch. Category may not exist.");
            })
            .WithName("CreateGalleryImageBatch")
            .RequireAuthorization(Roles.Administrator, Roles.Mage)
            .WithOpenApi();

            // --------------------------------------------------------------------------
            // Endpoint 5: POST /api/gallery/single (Add single image to existing folder)
            // --------------------------------------------------------------------------
            group.MapPost("/single", async (GalleryImageCreateSingleDto dto, GalleryInterface galleryService) =>
            {
                var newImage = await galleryService.CreateSingleImageAsync(dto);
                return newImage != null ? Results.Created($"/api/gallery/{dto.CategoryId}/{newImage.GalleryImageId}", newImage) : Results.BadRequest("Failed to add single image.");
            })
            .WithName("CreateSingleGalleryImage")
            .RequireAuthorization(Roles.Administrator, Roles.Mage)
            .WithOpenApi();

            // ------------------------------------------------------------------------------------
            // Endpoint 6: PUT /api/gallery/folder/{categoryId:int} (Update ALL images in a folder)
            // ------------------------------------------------------------------------------------
            group.MapPut("/folder/{categoryId:int}", async (int categoryId, GalleryImageUpdateFolderDto dto, GalleryInterface galleryService) =>
            {
                bool success = await galleryService.UpdateGalleryFolderAsync(categoryId, dto);
                return success ? Results.NoContent() : Results.NotFound($"Category with ID {categoryId} not found.");
            })
            .WithName("UpdateGalleryFolder")
            .RequireAuthorization(Roles.Administrator, Roles.Mage)
            .WithOpenApi();

            // ---------------------------------------------------------------------------------------
            // Endpoint 7: DELETE /api/gallery/folder/{categoryId:int} (Delete ALL images in a folder)
            // ---------------------------------------------------------------------------------------
            group.MapDelete("/folder/{categoryId:int}", async (int categoryId, GalleryInterface galleryService) =>
            {
                bool success = await galleryService.DeleteGalleryFolderAsync(categoryId);
                return success ? Results.NoContent() : Results.NotFound($"Category with ID {categoryId} not found.");
            })
            .WithName("DeleteGalleryFolder")
            .RequireAuthorization(Roles.Administrator, Roles.Mage)
            .WithOpenApi();

            // ---------------------------------------------------------------------------
            // Endpoint 8: DELETE /api/gallery/images/{imageId:long} (Delete single image)
            // ---------------------------------------------------------------------------
            group.MapDelete("/images/{imageId:long}", async (long imageId, GalleryInterface galleryService) =>
            {
                bool success = await galleryService.DeleteImageAsync(imageId);
                return success ? Results.NoContent() : Results.NotFound($"Image with ID {imageId} not found.");
            })
            .WithName("DeleteSingleGalleryImage")
            .RequireAuthorization(Roles.Administrator, Roles.Mage)
            .WithOpenApi();
        }
    }
}
