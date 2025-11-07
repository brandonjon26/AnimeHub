using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AnimeHub.Api.Repositories
{
    public class UserProfileRepository : IUserProfileRepository
    {
        private readonly AnimeHubDbContext _context;
        private readonly DbSet<UserProfile> _dbSet;

        public UserProfileRepository(AnimeHubDbContext context)
        {
            _context = context;
            _dbSet = context.Set<UserProfile>();
        }

        public async Task<UserProfile?> GetProfileByUserIdAsync(string userId)
        {
            // Use FindAsync for efficiency when querying by PK (UserId is the PK)
            return await _dbSet.FindAsync(userId);
        }

        public async Task Add(UserProfile profile)
        {
            _dbSet.Add(profile);
        }

        public async Task Update(UserProfile profile)
        {
            // EF Core tracking will handle this if the entity was retrieved via FindAsync/other tracking query.
            // Explicit Update call ensures it's marked correctly if detached.
            _dbSet.Update(profile);
        }

        public async Task<bool> Delete(string userId)
        {
            // 1. Find the profile using the primary key
            var profileToDelete = await _dbSet.FindAsync(userId);

            if (profileToDelete == null)
            {
                // Profile not found
                return false;
            }

            // 2. Mark for removal
            _dbSet.Remove(profileToDelete);

            // NOTE: We rely on the service layer to call SaveChangesAsync() after this, 
            // but for simplicity in this specific repository, we can save immediately, or
            // stick to the service handling the save. Given the service handles save for ADD/UPDATE,
            // we will let the service handle it for DELETE as well, returning true for success.

            return true;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
