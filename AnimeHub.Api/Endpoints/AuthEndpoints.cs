using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Services;
using AnimeHub.Api.Entities;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Endpoints
{
    public static class AuthEndpoints
    {
        // The base route for all authentication operations
        private const string AuthRoute = "/auth";

        // Extension method to map the authentication endpoints
        public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup(AuthRoute)
                .WithTags("Authentication");

            // POST /auth/register
            group.MapPost("/register", RegisterUser)
                .WithName("RegisterUser")
                .Produces<UserResponseDto>(StatusCodes.Status200OK)
                .Produces(StatusCodes.Status400BadRequest)
                .AllowAnonymous(); // Must be public for users to sign up

            // POST /auth/login
            group.MapPost("/login", LoginUser)
                .WithName("LoginUser")
                .Produces<string>(StatusCodes.Status200OK) // JWT Token as a string
                .Produces(StatusCodes.Status401Unauthorized)
                .AllowAnonymous(); // Must be public for users to log in

            return routes;
        }

        // --- Endpoint Handlers ---

        // Handler for POST /auth/register
        private static async Task<IResult> RegisterUser(
            [FromBody] RegisterDto registerDto,
            [FromServices] AuthInterface authService,
            [FromServices] UserManager<IdentityUser> userManager)
        {
            // Pre-check for existing user (good practice for clearer error messages)
            if (await userManager.FindByEmailAsync(registerDto.Email) != null ||
                await userManager.FindByNameAsync(registerDto.UserName) != null)
            {
                // Returning a structured problem details response
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    { "Identity", new[] { "An account with this email or username already exists." } }
                });
            }

            // Call the service layer to perform registration and auto-login
            // Update variable type to UserResponseDto
            UserResponseDto? response = await authService.RegisterAsync(registerDto);

            // Handle failure based on null response from the service
            if (response is null)
            {
                // Registration failed due to internal Identity validation (e.g., password complexity)
                // NOTE: Since AuthService doesn't return IdentityResult errors anymore, 
                // the service should ideally throw an exception containing the IdentityResult 
                // errors, which we then catch and convert to a ValidationProblem here.

                // For now, we return a general 400 error as a fallback for internal errors:
                return Results.BadRequest("Registration failed. Please check password complexity and details.");
            }

            // Return the fully formed DTO (Success case)
            return Results.Ok(response);
        }

        // Handler for POST /auth/login
        private static async Task<IResult> LoginUser(
         [FromBody] LoginDto loginDto,
         [FromServices] AuthInterface authService) // Only need IAuthService now
        {
            // Call the service layer to perform login, generate token, and map response
            UserResponseDto? response = await authService.LoginAsync(loginDto);

            if (response is null)
            {
                return Results.Unauthorized();
            }

            // Return the fully formed, secure DTO
            return Results.Ok(response);
        }
    }
}
