using AnimeHub.Api.Entities;
using System.Linq.Expressions;

namespace AnimeHub.Api.Repositories
{
    public interface IBaseRepository<T> where T : class // T must be a class (our entities)
    {
        // Query Methods
        Task<IEnumerable<T>> GetAllAsync(); // Read operations (Non-tracking for performance on GET requests)
        Task<T?> GetReadOnlyByIdAsync(long id); // Find by primary key for read-only (Non-tracking)
        Task<T?> GetReadOnlyByIdAsync(int id);
        Task<T?> GetTrackedByIdAsync(long id); // Find by primary key for read/write (Tracking required for UPDATE/DELETE)
        Task<T?> GetTrackedByIdAsync(int id);
        Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null);


        // CRUD Methods
        Task Add(T entity);
        Task Update(T entity);
        Task Delete(T entity);
        Task DeleteRange(IEnumerable<T> entities);
        Task<int> SaveChangesAsync();
    }
}
