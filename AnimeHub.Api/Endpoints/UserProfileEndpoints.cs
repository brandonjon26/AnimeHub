using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AnimeHub.Api.Endpoints
{
    public static class UserProfileEndpoints
    {
        private const string ProfileRoute = "/profile";

        public static IEndpointRouteBuilder MapUserProfileEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup(ProfileRoute)
                .WithTags("User Profiles")
                .RequireAuthorization(); // Requires a valid JWT token for all methods in this group!;

            group.MapPut("/{userId}", UpdateProfile)
                .WithName("UpdateProfile")
                .Produces<UserProfileUpdateDto>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status400BadRequest)
                .Produces(StatusCodes.Status401Unauthorized) // Requires Auth
                .Produces(StatusCodes.Status403Forbidden) // Authorization failure
                .Produces(StatusCodes.Status404NotFound);

            // DELETE /profile/{userId}
            group.MapDelete("/{userId}", DeleteProfile)
                .WithName("DeleteProfile")
                .Produces(StatusCodes.Status204NoContent)
                .Produces(StatusCodes.Status401Unauthorized) // Requires Auth
                .Produces(StatusCodes.Status403Forbidden)    // Authorization failure
                .Produces(StatusCodes.Status404NotFound);

            return routes;
        }

        #region Endpoint Handlers
        // --- Endpoint Handlers ---

        private static async Task<IResult> UpdateProfile(
            [FromRoute] string userId,
            [FromBody] UserProfileUpdateDto updateDto,
            [FromServices] UserProfileInterface profileService, // User's preferred interface name
            ClaimsPrincipal user) // Inject ClaimsPrincipal (The authenticated user)
        {
            // Ensure the authenticated user matches the requested userId
            // The Identity Framework stores the User ID in the ClaimTypes.NameIdentifier
            string? authenticatedUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (authenticatedUserId is null || authenticatedUserId != userId)
            {
                // If the authenticated ID doesn't match the route ID, deny access.
                return Results.Forbid(); // Returns 403 Forbidden
            }

            // Proceed with business logic (only runs if the user is authorized)
            UserProfile? updatedProfile = await profileService.UpdateProfileAsync(userId, updateDto);

            if (updatedProfile == null)
            {
                return Results.NotFound($"User profile with ID {userId} not found.");
            }

            // Return the updated DTO (or a custom success message)
            // Note: Returning the input DTO is often easiest, or we can map the resulting UserProfile entity.
            return Results.Ok(updateDto);
        }

        // DeleteProfile Handler
        private static async Task<IResult> DeleteProfile(
            [FromRoute] string userId,
            [FromServices] UserProfileInterface profileService,
            ClaimsPrincipal user) // Inject the authenticated user
        {
            // AUTHORIZATION CHECK: Ensure the authenticated user matches the requested userId
            string? authenticatedUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (authenticatedUserId is null || authenticatedUserId != userId)
            {
                // If the token ID doesn't match the route ID, deny access.
                return Results.Forbid(); // 403 Forbidden
            }

            // Business Logic: Call service to delete the profile
            bool success = await profileService.DeleteUserAccountAsync(userId);

            if (!success)
            {
                return Results.NotFound($"User profile with ID {userId} not found.");
            }

            // Success: 204 No Content (Standard response for successful DELETE)
            return Results.NoContent();
        }

        #endregion
    }
}
