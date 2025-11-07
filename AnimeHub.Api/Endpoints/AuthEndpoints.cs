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
                .Produces(StatusCodes.Status200OK)
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
            [FromServices] AuthInterface authService)
        {
            // 1. Call the service layer to perform registration logic
            var result = await authService.RegisterAsync(registerDto);

            if (result.Succeeded)
            {
                // 2. Return success
                return Results.Ok(new { message = "Registration successful. Welcome, Villager!" });
            }

            // 3. Handle failure (e.g., password complexity, user already exists check is handled within the service/identity)
            // Transform IdentityResult errors into a readable ValidationProblem
            var errors = result.Errors
                .ToDictionary(e => e.Code, e => new[] { e.Description });

            return Results.ValidationProblem(errors);
        }

        // Handler for POST /auth/login
        private static async Task<IResult> LoginUser(
         [FromBody] LoginDto loginDto,
         [FromServices] AuthInterface authService) // Only need IAuthService now
        {
            // 1. Call the service layer to perform login, generate token, and map response
            UserResponseDto? response = await authService.LoginAsync(loginDto);

            if (response is null)
            {
                return Results.Unauthorized();
            }

            // 2. Return the fully formed, secure DTO
            return Results.Ok(response);
        }
    }
}
