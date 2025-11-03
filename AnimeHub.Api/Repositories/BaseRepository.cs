using AnimeHub.Api.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace AnimeHub.Api.Repositories
{
    // T must be a class (our entities) and it implements the IRepository interface
    public abstract class BaseRepository<T> : IBaseRepository<T> where T : class
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

        public async Task<T?> GetTrackedByIdAsync(long id)
        {
            // Uses FindAsync (which checks tracking first) or attaches the entity for UPDATE/DELETE
            return await _dbSet.FindAsync(id);
        }
    }
}
