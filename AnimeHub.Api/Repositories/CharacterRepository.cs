using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Character;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AnimeHub.Api.Repositories
{
    public class CharacterRepository : BaseRepository<CharacterProfile>, ICharacterRepository
    {
        public CharacterRepository(AnimeHubDbContext context) 
            : base(context)
        {
        }

        // Retrieves the profile and eagerly loads all related Attires and Accessories.
        public async Task<CharacterProfile?> GetProfileWithDetailsAsync(string characterName)
        {
            // Normalize the input name for lookup (e.g., "Ayami" matches "ayami")
            string normalizedName = characterName.Trim().ToLowerInvariant();

            return await _context.CharacterProfiles
                .Where(p => p.FirstName.ToLowerInvariant() == normalizedName)
                .Include(p => p.BestFriend)
                .Include(p => p.GreatestFeatLore)
                .Include(p => p.Attires)
                .ThenInclude(a => a.AccessoryLinks) // Navigate through the join table
                .ThenInclude(aal => aal.Accessory) // Then include the actual Accessory entity
                .FirstOrDefaultAsync();
        }

        // Implementation of GetAttireByIdAsync
        public async Task<CharacterAttire?> GetAttireByIdAsync(int attireId)
        {
            // We use the context directly to access the AyamiAttires table
            return await _context.CharacterAttires.FirstOrDefaultAsync(a => a.CharacterAttireId == attireId);
        }
    }
}
