using AnimeHub.Api.Services;
using AnimeHub.Api.DTOs.Character;
using AnimeHub.Api.DTOs.Character.Lore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using AnimeHub.Api.Entities;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace AnimeHub.Api.Endpoints
{
    public static class CharacterEndpoints
    {
        private const string CharacterProfileTag = "Character Profiles"; // Tag for Swagger/OpenAPI
        private const string LoreTag = "Character Lore";

        public static void MapCharacterEndpoints(this IEndpointRouteBuilder routes)
        {
            // Define the base group using the character name as the key
            var characterGroup = routes.MapGroup("/characters/{characterName}")
                .WithTags(CharacterProfileTag)
                .RequireAuthorization();

            // Define the Lore-specific group (Lore is an application-wide resource)
            var loreGroup = routes.MapGroup("/lore")
                .WithTags(LoreTag);


            // --- 1. GET: Retrieve Character Profile (Read) ---
            // GET /characters/{characterName}
            characterGroup.MapGet("/", async (
                [FromRoute] string characterName, 
                CharacterInterface service) =>
            {
                // Retrieve the full Ayami profile, including Attires and Accessories
                CharacterProfileDto? profile = await service.GetCharacterProfileAsync(characterName);

                // Return 404 if the single profile entry doesn't exist
                return profile is null ? Results.NotFound() : Results.Ok(profile);
            })
            .WithName("GetCharacterProfile")
            .WithDescription("Retrieves the complete character profile by name.")
            .RequireAuthorization() // Requires ANY logged-in user (Villager, Mage, Admin)
            .WithOpenApi();


            // --- 2. UPDATE: Update Core Profile Details (Write) ---
            // PUT /characters/{characterName}/profile/{profileId}
            characterGroup.MapPut("/profile/{profileId:int}", async (
                [FromRoute] int profileId,
                [FromBody] CharacterProfileUpdateDto updateDto,
                CharacterInterface service) =>
            {
                bool success = await service.UpdateProfileAsync(profileId, updateDto);
                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithName("UpdateCharacterProfile")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status401Unauthorized) // Added Unauthorized
            .Produces(StatusCodes.Status403Forbidden)    // Added Forbidden
            .ProducesValidationProblem()
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles
            .WithOpenApi();


            // --- 3. CREATE: Add a new Attire (Write) ---
            // POST /characters/{characterName}/attire/{profileId}
            characterGroup.MapPost("/attire/{profileId:int}", async (
                [FromRoute] int profileId,
                [FromBody] CharacterAttireInputDto attireDto,
                CharacterInterface service) =>
            {
                int? newId = await service.AddAttireAsync(profileId, attireDto);
                if (newId is null)
                {
                    // Assuming null means the base profile (ID 1) wasn't found
                    return Results.BadRequest($"Character Profile (ID: {profileId}) not found.");
                }

                // Return 201 Created with the location of the new resource
                return Results.Created($"/characters/{profileId}/attire/{newId}", newId);
            })
            .WithName("AddCharacterAttire")
            .Produces<int>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .ProducesValidationProblem()
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles
            .WithOpenApi();


            // --- 4. DELETE: Delete an Attire (Write) ---
            // DELETE /characters/{characterName}/attire/{attireId}
            characterGroup.MapDelete("/attire/{attireId:int}", async (
                [FromRoute] int attireId,
                CharacterInterface service) =>
            {
                bool success = await service.DeleteAttireAsync(attireId);
                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithName("DeleteCharacterAttire")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles;
            .WithOpenApi();


            // -----------------------------------------------------------------
            // NEW LORE ENDPOINTS (Read access is open to all Villager/Mage/Admin)
            // -----------------------------------------------------------------

            // --- 5. GET: Get All Lore Types ---
            // GET /lore/types
            loreGroup.MapGet("/types", async (CharacterInterface service) =>
            {
                ICollection<LoreTypeDto> types = await service.GetAllLoreTypesAsync();
                return Results.Ok(types);
            })
            .WithName("GetAllLoreTypes")
            .WithDescription("Retrieves all available Lore Types (e.g., Quest, Relationship, Event).")
            .RequireAuthorization() // Requires ANY logged-in user (Villager, Mage, Admin)
            .WithOpenApi();


            // --- 6. GET: Get Single Lore Entry ---
            // GET /lore/{loreEntryId}
            loreGroup.MapGet("/{loreEntryId:int}", async (
                [FromRoute] int loreEntryId,
                CharacterInterface service) =>
            {
                LoreEntryDto? entry = await service.GetLoreEntryByIdAsync(loreEntryId);
                return entry is null ? Results.NotFound() : Results.Ok(entry);
            })
            .WithName("GetLoreEntryById")
            .WithDescription("Retrieves a single Lore Entry by its ID.")
            .RequireAuthorization() // Requires ANY logged-in user (Villager, Mage, Admin)
            .WithOpenApi();


            // --- 7. POST: Create New Lore Entry (Write) ---
            // POST /lore
            loreGroup.MapPost("/", async (
                [FromBody] LoreEntryInputDto loreEntryDto,
                CharacterInterface service) =>
            {
                int? newId = await service.CreateLoreEntryAsync(loreEntryDto);
                if (newId is null)
                {
                    return Results.BadRequest("Failed to create Lore Entry. Check if all character IDs are valid.");
                }

                return Results.Created($"/lore/{newId}", newId);
            })
            .WithName("CreateLoreEntry")
            .Produces<int>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest)
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles
            .WithOpenApi();


            // --- 8. PUT: Update Character's Greatest Feat (Write) ---
            // PUT /characters/{characterName}/greatest-feat/{profileId}
            characterGroup.MapPut("/greatest-feat/{profileId:int}", async (
                [FromRoute] int profileId,
                [FromBody] int loreEntryId, // The ID of the Lore Entry to link as the feat
                CharacterInterface service) =>
            {
                bool success = await service.UpdateCharacterGreatestFeatAsync(profileId, loreEntryId);
                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithName("UpdateCharacterGreatestFeat")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .RequireAuthorization("AdminAccess") // Restrict to Mage/Admin roles
            .WithOpenApi();


            // --- 9. DELETE: Delete a Lore Entry (Write) ---
            // DELETE /lore/{loreEntryId}
            loreGroup.MapDelete("/{loreEntryId:int}", async (
                [FromRoute] int loreEntryId,
                CharacterInterface service) =>
            {
                // The service layer handles the deletion AND the dependent CharacterProfile updates.
                bool success = await service.DeleteLoreEntryAsync(loreEntryId);

                return success ? Results.NoContent() : Results.NotFound();
            })
            .WithName("DeleteLoreEntry")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status401Unauthorized)
            .Produces(StatusCodes.Status403Forbidden)
            .RequireAuthorization("AdminAccess") // Must be restricted, as it deletes data.
            .WithOpenApi();
        }
    }
}
