using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Ayami;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Repositories
{
    public class AyamiRepository : BaseRepository<AyamiProfile>, IAyamiRepository
    {
        public AyamiRepository(AnimeHubDbContext context) 
            : base(context)
        {
        }

        // Retrieves the profile and eagerly loads all related Attires and Accessories.
        public async Task<AyamiProfile?> GetProfileWithDetailsAsync()
        {
            return await _context.AyamiProfiles
                .Include(p => p.Attires)
                .ThenInclude(a => a.Accessories) // Nested Include for the accessories
                .FirstOrDefaultAsync();
        }
    }
}
