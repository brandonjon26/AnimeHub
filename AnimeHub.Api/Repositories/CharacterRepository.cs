using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Character;
using AnimeHub.Api.Entities.Character.Lore;
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
            string normalizedName = characterName.Trim().ToLower();

            return await _context.CharacterProfiles
                .Where(p => p.FirstName.ToLower() == normalizedName)
                .Include(p => p.BestFriend)
                .Include(p => p.GreatestFeatLore)
                .Include(p => p.Attires)
                .ThenInclude(a => a.AccessoryLinks) // Navigate through the join table
                .ThenInclude(aal => aal.Accessory) // Then include the actual Accessory entity
                .Include(p => p.LoreLinks) // Include the join table entity (CharacterLoreLink)
                .ThenInclude(cll => cll.LoreEntry) // Then include the actual Lore Entry entity
                .ThenInclude(le => le.LoreType) // Then include the LoreType (Needed for DTO mapping of LoreType.Name)
                .FirstOrDefaultAsync();
        }

        // Implementation of GetAttireByIdAsync
        public async Task<CharacterAttire?> GetAttireByIdAsync(int attireId)
        {
            // We use the context directly to access the AyamiAttires table
            return await _context.CharacterAttires.FirstOrDefaultAsync(a => a.CharacterAttireId == attireId);
        }

        /// <summary>
        /// Retrieves a lightweight list of all Lore Entries available in the database.
        /// </summary>
        /// <returns>List of Lore Entries</returns>
        public async Task<ICollection<LoreEntry>> GetAllLoreEntriesAsync()
        {
            // Fetch all entries without tracking them, as they are only used for DTO mapping
            return await _context.LoreEntries
                .AsNoTracking()
                .OrderBy(le => le.Title)
                .ToListAsync();
        }

        /// <summary>
        /// Batch updates all CharacterProfiles that link to a specific LoreEntryId, setting their GreatestFeatLoreId to the sentinel value (0).
        /// </summary>
        /// <param name="loreEntryIdToClear"></param>
        /// <param name="sentinelId"></param>
        /// <returns></returns>
        public async Task<int> ClearGreatestFeatLinkAsync(int loreEntryIdToClear, int sentinelId)
        {
            // Executes a single UPDATE SQL statement against the database.
            // This is vastly more efficient than fetching all entities and updating them in a loop.
            return await _context.CharacterProfiles
                .Where(p => p.GreatestFeatLoreId == loreEntryIdToClear)
                .ExecuteUpdateAsync(setter => setter
                    .SetProperty(p => p.GreatestFeatLoreId, sentinelId));
        }
    }
}
