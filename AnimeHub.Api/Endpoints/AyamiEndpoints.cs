using AnimeHub.Api.Services;
using AnimeHub.Api.DTOs.Ayami;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using AnimeHub.Api.Entities;
using Microsoft.AspNetCore.Authorization;

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
            group.MapGet("/", async (CharacterInterface service) =>
            {
                // Retrieve the full Ayami profile, including Attires and Accessories
                CharacterProfileDto? profile = await service.GetAyamiProfileAsync();

                // Return 404 if the single profile entry doesn't exist
                return profile is null ? Results.NotFound() : Results.Ok(profile);
            })
            .WithName("GetAyamiProfile")
            .WithDescription("Retrieves the complete Ayami Kageyama character profile.")
            .RequireAuthorization() // Requires ANY logged-in user (Villager, Mage, Admin)
            .WithOpenApi(); 

            // UPDATE: Update Core Profile Details
            group.MapPut("/{profileId}", async (
                int profileId,
                [FromBody] AyamiProfileUpdateDto updateDto,
                CharacterInterface service) =>
            {
                var success = await service.UpdateProfileAsync(profileId, updateDto);
                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithName("UpdateAyamiProfile")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status401Unauthorized) // Added Unauthorized
            .Produces(StatusCodes.Status403Forbidden)    // Added Forbidden
            .ProducesValidationProblem()
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles
            .WithOpenApi();


            // CREATE: Add a new Attire
            group.MapPost("/{profileId}/attire", async (
                int profileId,
                [FromBody] CharacterAttireInputDto attireDto,
                CharacterInterface service) =>
            {
                var newId = await service.AddAttireAsync(profileId, attireDto);
                if (newId is null)
                {
                    // Assuming null means the base profile (ID 1) wasn't found
                    return Results.BadRequest("Base Ayami Profile not found.");
                }

                // Return 201 Created with the location of the new resource
                return Results.Created($"/ayami-profile/attire/{newId}", newId);
            })
            .WithName("AddAyamiAttire")
            .Produces<int>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .ProducesValidationProblem()
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles
            .WithOpenApi();


            // DELETE: Delete an Attire
            group.MapDelete("/attire/{attireId:int}", async (
                [FromRoute] int attireId,
                CharacterInterface service) =>
            {
                var success = await service.DeleteAttireAsync(attireId);
                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithName("DeleteAyamiAttire")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles;
            .WithOpenApi();
        }
    }
}
