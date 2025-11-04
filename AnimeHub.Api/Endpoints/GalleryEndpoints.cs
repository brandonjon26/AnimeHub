using AnimeHub.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.OpenApi;

namespace AnimeHub.Api.Endpoints
{
    public static class GalleryEndpoints
    {
        public static void MapGalleryEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/gallery").WithTags("Gallery");

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

            // ---------------------------------------------------------------------
            // Endpoint 2: GET /api/gallery/folders (Get the album metadata for links)
            // ---------------------------------------------------------------------
            group.MapGet("/folders", async (GalleryInterface galleryService) =>
            {
                var folders = await galleryService.GetAllCategoriesAsync();
                return Results.Ok(folders);
            })
            .WithName("GetGalleryFolders")
            .WithOpenApi();

            // ---------------------------------------------------------------------
            // Endpoint 3: GET /api/gallery/{categoryName} (Get all photos for an album)
            // ---------------------------------------------------------------------
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
        }
    }
}
