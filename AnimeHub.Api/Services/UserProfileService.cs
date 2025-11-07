using AnimeHub.Api.Data;
using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;

namespace AnimeHub.Api.Services
{
    public class UserProfileService : UserProfileInterface
    {
        private readonly IUserProfileRepository _repository;
        private readonly UserManager<IdentityUser> _userManager;

        public UserProfileService(IUserProfileRepository repository, UserManager<IdentityUser> userManager)
        {
            _repository = repository;
            _userManager = userManager;
        }

        public async Task<UserProfile> CreateProfileAsync(string userId, RegisterDto dto)
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

        public async Task<UserProfile?> GetProfileByUserIdAsync(string userId)
        {
            return await _repository.GetProfileByUserIdAsync(userId);
        }

        public async Task<UserProfile?> UpdateProfileAsync(string userId, UserProfileUpdateDto dto)
        {
            // Find profile (it will be tracked by the repository's context)
            UserProfile? existingProfile = await _repository.GetProfileByUserIdAsync(userId);

            if (existingProfile == null)
            {
                // This shouldn't happen if the IdentityUser exists, but check for safety
                return null;
            }

            // 1. Apply changes from the DTO
            existingProfile.FirstName = dto.FirstName;
            existingProfile.LastName = dto.LastName;
            existingProfile.Location = dto.Location;

            // 2. Check if Birthday changed and recalculate IsAdult flag
            if (existingProfile.Birthday != dto.Birthday)
            {
                existingProfile.Birthday = dto.Birthday;
                // Re-use the existing helper to recalculate age
                existingProfile.IsAdult = CalculateIsAdult(dto.Birthday);
            }

            // 3. Save changes
            await _repository.Update(existingProfile);
            await _repository.SaveChangesAsync();

            return existingProfile;
        }

        public async Task<bool> DeleteUserAccountAsync(string userId)
        {
            // 1. Find the Identity user
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            // 2. Use UserManager to delete the user. 
            // This is the primary table and will trigger the cascade delete 
            // to the custom 'UserProfiles' table (provided you set up cascade delete 
            // in the DbContext model configuration).
            var result = await _userManager.DeleteAsync(user);

            return result.Succeeded;
        }

        public async Task<bool> DeleteProfileAsync(string userId)
        {
            // 1. Call the repository to delete the record (if found)
            bool profileFoundAndMarkedForDeletion = await _repository.Delete(userId);

            if (!profileFoundAndMarkedForDeletion)
            {
                return false;
            }

            // 2. Commit the transaction
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
