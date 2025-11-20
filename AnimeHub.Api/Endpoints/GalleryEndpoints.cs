using AnimeHub.Api.DTOs.GalleryImage;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Routing;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http;

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
                IEnumerable<GalleryImageDto> featured = await galleryService.GetFeaturedImagesAsync();
                return Results.Ok(featured);
            })
            .WithName("GetFeaturedImages")
            .WithOpenApi();

            // -----------------------------------------------------------------------
            // Endpoint 2: GET /api/gallery/folders (Get the album metadata for links)
            // -----------------------------------------------------------------------
            group.MapGet("/folders", async (GalleryInterface galleryService) =>
            {
                IEnumerable<GalleryImageCategoryDto> folders = await galleryService.GetAllCategoriesAsync();
                return Results.Ok(folders);
            })
            .WithName("GetGalleryFolders")
            .WithOpenApi();

            // -------------------------------------------------------------------------
            // Endpoint 3: GET /api/gallery/{categoryName} (Get all photos for an album)
            // -------------------------------------------------------------------------
            group.MapGet("/{categoryName}", async (string categoryName, GalleryInterface galleryService, HttpContext context, UserProfileInterface userProfileService) =>
            {
                // Retrieve the user principal from the context
                ClaimsPrincipal userPrincipal = context.User;
                bool isAdult = false;

                // 1. Check if the user is authenticated at all
                if (userPrincipal.Identity != null && userPrincipal.Identity.IsAuthenticated)
                {
                    // 2. Find the standard User ID (NameIdentifier) claim
                    // This claim holds the unique ASP.NET Identity User ID (Guid).
                    string? userId = userPrincipal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

                    if (!string.IsNullOrEmpty(userId))
                    {
                        // 3. Use the User ID to fetch the profile from the database
                        UserProfile? profile = await userProfileService.GetProfileByUserIdAsync(userId);

                        if (profile != null)
                        {
                            // 4. Retrieve the IsAdult flag from the profile DTO
                            isAdult = profile.IsAdult;
                        }
                    }
                }

                IEnumerable<GalleryImageDto> images = await galleryService.GetImagesByCategoryNameAsync(categoryName, isAdult);

                if (images == null || !images.Any())
                {
                    // Return 404 if the album doesn't exist OR if access was blocked by the security check
                    // NOTE: We return 404 here, but returning 200 with an empty list is often safer to hide structure. 
                    // Given the service returns an empty list upon block, we check the count.
                    // We will stick to returning an empty list (200 OK) for consistency and to avoid revealing the block reason.
                    return Results.Ok(images);
                }

                return Results.Ok(images);
            })
            .WithName("GetImagesByCategory")
            .WithOpenApi();

            // ----------------------------------------------------------------------------
            // Endpoint 4: POST /api/gallery/batch (Create New Folder/Category with images)
            // ----------------------------------------------------------------------------
            group.MapPost("/batch", async (HttpContext context, GalleryInterface galleryService) =>
            {
                //if (request.Files == null || request.Files.Length == 0)
                //{
                //    return Results.BadRequest("No files were provided for upload.");
                //}

                // Manually read the form data to force correct binding
                IFormCollection form = await context.Request.ReadFormAsync();

                // 1. Retrieve the Metadata string
                string metadataString = form["Metadata"].FirstOrDefault() ?? "";

                // 2. Retrieve the Files array
                IFormFileCollection formFiles = form.Files;
                IFormFile[] files = formFiles.ToArray();

                if (files.Length == 0)
                {
                    return Results.BadRequest("No files were provided for upload.");
                }

                // CRITICAL: Deserialize the JSON Metadata string into the DTO expected by the Service Layer.
                GalleryImageCreateBatchDto? metadataDto;
                try
                {
                    metadataDto = JsonSerializer.Deserialize<GalleryImageCreateBatchDto>(
                        metadataString,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    );
                }
                catch (JsonException)
                {
                    return Results.BadRequest("Invalid JSON metadata format.");
                }

                if (metadataDto == null)
                {
                    return Results.BadRequest("Missing or invalid image batch metadata.");
                }

                // CHANGE: Call the service with the DTO and the IFormFile array
                // The service layer will now handle mapping, file storage, and database insertion.
                int newCategoryId = await galleryService.CreateImageBatchAsync(metadataDto, files);

                return newCategoryId > 0
                    ? Results.Created($"/api/gallery/{newCategoryId}", null)
                    : Results.BadRequest("Failed to create gallery batch. Category name may be in use.");
            })
            .WithName("CreateGalleryImageBatch")
            .RequireAuthorization("AdminAccess")
            .WithOpenApi();

            // --------------------------------------------------------------------------
            // Endpoint 5: POST /api/gallery/single (Add single image to existing folder)
            // --------------------------------------------------------------------------
            group.MapPost("/single", async (GalleryImageCreateSingleDto dto, GalleryInterface galleryService) =>
            {
                GalleryImageDto? newImage = await galleryService.CreateSingleImageAsync(dto);
                return newImage != null ? Results.Created($"/api/gallery/{dto.CategoryId}/{newImage.GalleryImageId}", newImage) : Results.BadRequest("Failed to add single image.");
            })
            .WithName("CreateSingleGalleryImage")
            .RequireAuthorization("AdminAccess")
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
            .RequireAuthorization("AdminAccess")
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
            .RequireAuthorization("AdminAccess")
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
            .RequireAuthorization("AdminAccess")
            .WithOpenApi();

            // --------------------------------------------------------------------------------------
            // Endpoint 9: PUT /api/gallery/images/{imageId:long} (Update single image metadata/category)
            // --------------------------------------------------------------------------------------
            group.MapPut("/images/{imageId:long}", async (long imageId, GalleryImageUpdateSingleDto dto, GalleryInterface galleryService) =>
            {
                // The service layer handles finding the image by ID and applying the DTO changes (category move, maturity flag update).
                bool success = await galleryService.UpdateSingleImageAsync(imageId, dto);

                return success
                    ? Results.NoContent()
                    : Results.NotFound($"Image with ID {imageId} not found, or new category ID is invalid.");
            })
            .WithName("UpdateSingleGalleryImage")
            .RequireAuthorization("AdminAccess")
            .WithOpenApi();
        }
    }
    }
}
