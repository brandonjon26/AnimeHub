using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Repositories
{
    public class AnimeRepository : BaseRepository<Anime>, IAnimeRepository
    {
        // Calls the base constructor to initialize _context and _dbSet
        public AnimeRepository(AnimeHubDbContext context)
            : base(context)
        {
        }

        // Future complex Anime-specific methods will be implemented here.
    }
}
