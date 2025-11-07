using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Repositories
{
    public interface IUserProfileRepository 
    {
        Task<UserProfile?> GetProfileByUserIdAsync(string userId);
        Task Add(UserProfile profile);
        Task Update(UserProfile profile);
        Task<int> SaveChangesAsync();

        Task<bool> Delete(string userId);
        // Note: Delete is usually handled by Identity itself or is a high-level service call.
    }
}
