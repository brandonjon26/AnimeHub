using System;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Repositories;
using AnimeHub.Shared.Enums;
using AnimeHub.Shared.Utilities;
using AnimeHub.Shared.Utilities.Exceptions;
using AnimeHub.Shared.Utilities.Exceptions.DuplicateDataExceptions;

namespace AnimeHub.Api.Services
{
    public class UserProfileService : UserProfileInterface
    {
        private readonly IUserProfileRepository _repository;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IValidator<RegisterDto> _registerValidator;

        public UserProfileService(IUserProfileRepository repository, UserManager<IdentityUser> userManager, IValidator<RegisterDto> registerValidator)
        {
            _repository = repository;
            _userManager = userManager;
            _registerValidator = registerValidator;
        }

        public async Task<UserProfile> CreateProfileAsync(string userId, RegisterDto dto)
        {
            try
            {
                // Calculate the IsAdult flag based on the provided Birthday
                bool isAdult = CalculateIsAdult(dto.Birthday);

                UserProfile profile = new UserProfile
                {
                    UserId = userId,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Birthday = dto.Birthday,
                    Location = dto.Location,
                    IsAdult = isAdult // Saved the calculated value
                };

                await _repository.Add(profile);
                await _repository.SaveChangesAsync();

                return profile;
            }
            catch (DbUpdateException dbEx)
            {
                // Generic .NET/EF error; Translate to AnimeHub exception type
                throw new AnimeHubException("A database error occurred while creating your account.", 500, dto, dbEx);
            }
            catch (Exception ex)
            {
                throw new AnimeHubException("An unexpected system error occurred", 500, dto, ex, Shared.Enums.LogLevel.Error, LogSource.Security);
            }            
        }

        public async Task<UserProfile?> GetProfileByUserIdAsync(string userId)
        {
            return await _repository.GetProfileByUserIdAsync(userId);
        }

        public async Task<UserProfile?> UpdateProfileAsync(string userId, UserProfileUpdateDto dto)
        {
            try
            {
                // Find profile (it will be tracked by the repository's context)
                UserProfile? existingProfile = await _repository.GetProfileByUserIdAsync(userId);

                if (existingProfile == null)
                {
                    // Throw a specific domain exception rather than returning null
                    throw new UserProfileNotFoundException($"Profile for User ID {userId} could not be found.", new { UserId = userId });
                }

                // Apply changes from the DTO
                existingProfile.FirstName = dto.FirstName;
                existingProfile.LastName = dto.LastName;
                existingProfile.Location = dto.Location;

                // Check if Birthday changed and recalculate IsAdult flag
                if (existingProfile.Birthday != dto.Birthday)
                {
                    existingProfile.Birthday = dto.Birthday;
                    // Re-use the existing helper to recalculate age
                    existingProfile.IsAdult = CalculateIsAdult(dto.Birthday);
                }

                // Save changes
                await _repository.Update(existingProfile);
                await _repository.SaveChangesAsync();

                return existingProfile;
            }
            catch (AnimeHubException) { throw; }
            catch (Exception ex)
            {
                throw new AnimeHubException("Failed to update user profile.", 500, new { UserId = userId, UpdateData = dto }, ex);
            }            
        }

        public async Task<bool> DeleteUserAccountAsync(string userId)
        {
            try
            {
                // Find the Identity user
                var user = await _userManager.FindByIdAsync(userId);
                if (user == null)
                {
                    throw new UserProfileNotFoundException("User not found.", userId);
                }

                // Use UserManager to delete the user. This is the primary table and will trigger the cascade delete to the custom 'UserProfiles' table
                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    throw new AnimeHubException("Identity User deletion failed.", 500, result.Errors);
                }

                return result.Succeeded;
            }
            catch (DbUpdateException dbEx)
            {
                // Generic .NET/EF error; Translate to AnimeHub exception type
                throw new AnimeHubException("A database error occurred while updating your account.", 500, new { UserId = userId }, dbEx);
            }
            catch (Exception ex)
            {
                throw new AnimeHubException("There was an internal server error.", 500, new { UserId = userId}, ex);
            }            
        }

        public async Task<bool> DeleteProfileAsync(string userId)
        {
            // Call the repository to delete the record
            bool profileFoundAndMarkedForDeletion = await _repository.Delete(userId);

            if (!profileFoundAndMarkedForDeletion)
            {
                return false;
            }

            // Commit the transaction
            await _repository.SaveChangesAsync();

            return true;
        }

        // Helper method (copied from AuthService) to determine if user is 18 or older
        private static bool CalculateIsAdult(DateOnly birthday)
        {
            DateOnly today = DateOnly.FromDateTime(DateTime.Today);
            int age = today.Year - birthday.Year;

            if (birthday > today.AddYears(-age))
            {
                age--;
            }

            return age >= 18;
        }
    }
}
