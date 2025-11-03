using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Repositories
{
    public interface IBaseRepository<T> where T : class // T must be a class (our entities)
    {
        // Read operations (Non-tracking for performance on GET requests)
        Task<IEnumerable<T>> GetAllAsync();

        // Find by primary key for read-only (Non-tracking)
        Task<T?> GetReadOnlyByIdAsync(long id);

        // Find by primary key for read/write (Tracking required for UPDATE/DELETE)
        Task<T?> GetTrackedByIdAsync(long id);

        // Future methods: AddAsync, UpdateAsync, DeleteAsync, SaveChangesAsync, etc.
    }
}
