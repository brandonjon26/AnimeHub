using AnimeHub.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace AnimeHub.Api.Repositories
{
    // T must be a class (our entities) and it implements the IRepository interface
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly AnimeHubDbContext _context;
        protected readonly DbSet<T> _dbSet;
        private readonly string _primaryKeyName; // Store the calculated PK name

        public BaseRepository(AnimeHubDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>(); // Gets the DbSet<T> for the specific entity

            // Dynamically determine the primary key name using EF Core's Model metadata
            var entityType = context.Model.FindEntityType(typeof(T));
            if (entityType is null)
            {
                throw new InvalidOperationException($"Cannot find entity type for {typeof(T).Name}");
            }
            // Gets the primary key object, then gets the first property's name (e.g., "AnimeId")
            _primaryKeyName = entityType.FindPrimaryKey()?.Properties.First().Name
                ?? throw new InvalidOperationException($"Entity {typeof(T).Name} does not have a defined primary key.");
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            // Use AsNoTracking for read-only list retrieval
            return await _dbSet.AsNoTracking().ToListAsync();
        }

        public async Task<T?> GetReadOnlyByIdAsync(long id)
        {
            // Uses FirstOrDefaultAsync combined with AsNoTracking for efficient read-only retrieval
            return await _dbSet.AsNoTracking().FirstOrDefaultAsync(e => EF.Property<long>(e, _primaryKeyName) == id);
            // NOTE: We used a workaround 'EF.Property' here because generic T doesn't know its PK name. 
            // We'll address this in the concrete repository.
        }

        /// <summary>
        /// Retrieves an entity by its primary key ID (INT overload), without tracking changes.
        /// </summary>
        /// <param name="id">The integer ID of the entity.</param>
        /// <returns>The entity or null if not found.</returns>
        public async Task<T?> GetReadOnlyByIdAsync(int id)
        {
            // Reuses the core logic. We need to cast the incoming 'int id' to 'long' 
            // for comparison against the potentially long primary key property, 
            // or rely on EF Core to handle the comparison of the key type.

            // However, a cleaner implementation for an INT primary key lookup is:
            return await _dbSet.AsNoTracking()
                .FirstOrDefaultAsync(e => EF.Property<int>(e, _primaryKeyName) == id);
        }

        public async Task<T?> GetTrackedByIdAsync(long id)
        {
            // Uses FindAsync (which checks tracking first) or attaches the entity for UPDATE/DELETE
            return await _dbSet.FindAsync(id);
        }

        public async Task<T?> GetTrackedByIdAsync(int id)
        {
            // Uses FindAsync (which checks tracking first) or attaches the entity for UPDATE/DELETE
            return await _dbSet.FindAsync(id);
        }

        public async Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>>? filter = null, string? includeProperties = null)
        {
            IQueryable<T> query = _dbSet;

            if (filter != null)
            {
                query = query.Where(filter);
            }

            if (includeProperties != null)
            {
                foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProp);
                }
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task Add(T entity)
        {
            _dbSet.Add(entity);
        }

        public async Task Update(T entity)
        {
            // For disconnected scenarios, we may need to explicitly attach and mark as modified.
            // For simplicity and common use cases, EF Core tracks the entity if it was queried
            // in the same context, but we ensure it's attached and marked if necessary.
            _dbSet.Update(entity);
        }

        public async Task Delete(T entity)
        {
            _dbSet.Remove(entity);
        }

        public async Task DeleteRange(IEnumerable<T> entities)
        {
            _dbSet.RemoveRange(entities);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
