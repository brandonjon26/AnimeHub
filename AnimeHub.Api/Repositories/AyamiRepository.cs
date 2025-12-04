using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Ayami;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Repositories
{
    public class AyamiRepository : BaseRepository<CharacterProfile>, IAyamiRepository
    {
        public AyamiRepository(AnimeHubDbContext context) 
            : base(context)
        {
        }

        // Retrieves the profile and eagerly loads all related Attires and Accessories.
        public async Task<CharacterProfile?> GetProfileWithDetailsAsync()
        {
            return await _context.AyamiProfiles
                .Include(p => p.Attires)
                .ThenInclude(a => a.AccessoryLinks) // Navigate through the join table
                .ThenInclude(aal => aal.Accessory) // Then include the actual Accessory entity
                .FirstOrDefaultAsync();
        }

        // Implementation of GetAttireByIdAsync
        public async Task<CharacterAttire?> GetAttireByIdAsync(int attireId)
        {
            // We use the context directly to access the AyamiAttires table
            return await _context.AyamiAttires.FirstOrDefaultAsync(a => a.AyamiAttireId == attireId);
        }
    }
}
