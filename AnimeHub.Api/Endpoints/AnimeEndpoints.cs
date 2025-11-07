using AnimeHub.Api.Services;
using AnimeHub.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Routing;
using AnimeHub.Api.Entities;
using Microsoft.AspNetCore.OpenApi;
using AnimeHub.Api.DTOs;

namespace AnimeHub.Api.Endpoints
{
    public static class AnimeEndpoints
    {
        public static void MapAnimeEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/anime")
                .WithTags("Anime")
                .AllowAnonymous(); // Explicitly allows public read access

            // --------------------------
            // Endpoint 1: GET /api/anime
            // --------------------------
            group.MapGet("/", async (AnimeInterface animeService) =>
            {
                // Get the list of all animes
                IEnumerable<AnimeDto> animeDtos = await animeService.GetAllAnimesAsync();

                // Returns 200 OK with the list of entities
                return Results.Ok(animeDtos); 
            })
            .WithName("GetAllAnime")
            .WithOpenApi(); // Essential for Swagger/OpenAPI documentation

            // -------------------------------------------
            // Endpoint 2: GET /api/anime/{id} (Get by ID)
            // -------------------------------------------
            group.MapGet("/{id}", async (long id, AnimeInterface animeService) =>
            {
                // Find the single anime by its primary key (AnimeId)
                AnimeDto? animeDto = await animeService.GetAnimeByIdAsync(id);

                if (animeDto is null)
                {
                    // If not found, return a 404 Not Found response
                    return Results.NotFound();
                }

                // If found, return a 200 OK response with the entity
                return Results.Ok(animeDto);
            })
            .WithName("GetAnimeById")
            .WithOpenApi();
        }
    }
}
