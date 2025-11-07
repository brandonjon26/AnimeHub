using AnimeHub.Api.Data;
using AnimeHub.Api.DTOs.Auth;
using AnimeHub.Api.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace AnimeHub.Api.Services
{
    public class UserProfileService : UserProfileInterface
    {
        private readonly AnimeHubDbContext _context;

        public UserProfileService(AnimeHubDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfile> CreateProfileAsync(string userId, RegisterDto dto)
        {
            // Calculate the IsAdult flag based on the provided Birthday
            bool isAdult = CalculateIsAdult(dto.Birthday);

            var profile = new UserProfile
            {
                UserId = userId,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Birthday = dto.Birthday,
                Location = dto.Location,
                IsAdult = isAdult // Saved the calculated value
            };

            _context.UserProfiles.Add(profile);
            await _context.SaveChangesAsync();

            return profile;
        }

        public async Task<UserProfile?> GetProfileByUserIdAsync(string userId)
        {
            return await _context.UserProfiles
                .AsNoTracking()
                .FirstOrDefaultAsync(up => up.UserId == userId);
        }

        // Helper method (copied from AuthService) to determine if user is 18 or older
        private static bool CalculateIsAdult(DateOnly birthday)
        {
            var today = DateOnly.FromDateTime(DateTime.Today);
            var age = today.Year - birthday.Year;

            if (birthday > today.AddYears(-age))
            {
                age--;
            }

            return age >= 18;
        }
    }
}
