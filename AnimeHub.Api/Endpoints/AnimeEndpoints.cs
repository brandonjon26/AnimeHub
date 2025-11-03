using AnimeHub.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Routing;
using AnimeHub.Api.Entities;
using Microsoft.AspNetCore.OpenApi;

namespace AnimeHub.Api.Endpoints
{
    public static class AnimeEndpoints
    {
        public static void MapAnimeEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/api/anime").WithTags("Anime");

            // --------------------------
            // Endpoint 1: GET /api/anime
            // --------------------------
            group.MapGet("/", async (AnimeHubDbContext context) =>
            {
                // Minimal API style: Inject DbContext directly into the lambda
                var animeList = await context.Anime.ToListAsync();

                // Returns 200 OK with the list of entities
                return Results.Ok(animeList); 
            })
            .WithName("GetAllAnime")
            .WithOpenApi(); // Essential for Swagger/OpenAPI documentation

            // -------------------------------------------
            // Endpoint 2: GET /api/anime/{id} (Get by ID)
            // -------------------------------------------
            group.MapGet("/{id}", async (long id, AnimeHubDbContext context) =>
            {
                // Find the single anime by its primary key (AnimeId)
                var anime = await context.Anime.FindAsync(id);

                if (anime is null)
                {
                    // If not found, return a 404 Not Found response
                    return Results.NotFound();
                }

                // If found, return a 200 OK response with the entity
                return Results.Ok(anime);
            })
            .WithName("GetAnimeById")
            .WithOpenApi();
        }
    }
}
