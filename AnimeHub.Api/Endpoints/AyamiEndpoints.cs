using AnimeHub.Api.Services;
using AnimeHub.Api.DTOs.Ayami;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;

namespace AnimeHub.Api.Endpoints
{
    public static class AyamiEndpoints
    {
        private const string AyamiProfileTag = "Ayami Profile"; // Tag for Swagger/OpenAPI

        public static void MapAyamiEndpoints(this IEndpointRouteBuilder routes)
        {
            // Define the base group for the Ayami endpoints
            var group = routes.MapGroup("/ayami-profile")
                .WithTags(AyamiProfileTag);

            // GET /ayami-profile
            group.MapGet("/", async (AyamiInterface service) =>
            {
                // Retrieve the full Ayami profile, including Attires and Accessories
                AyamiProfileDto? profile = await service.GetAyamiProfileAsync();

                // Return 404 if the single profile entry doesn't exist
                return profile is null ? Results.NotFound() : Results.Ok(profile);
            })
            .WithName("GetAyamiProfile")
            .WithDescription("Retrieves the complete Ayami Kageyama character profile.");
        }
    }
}
