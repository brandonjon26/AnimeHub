using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
using AnimeHub.Api.Entities.Enums;
using Microsoft.EntityFrameworkCore;

namespace AnimeHub.Api.Repositories
{
    public class GalleryRepository : BaseRepository<GalleryImage>, IGalleryRepository
    {
        public GalleryRepository(AnimeHubDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<GalleryImage>> GetFeaturedWithCategoryAsync()
        {
            return await _dbSet
                .Include(gi => gi.Category) // Eagerly load the Category
                .Where(gi => gi.IsFeatured)
                .AsNoTracking()
                .Take(2)
                .ToListAsync();
        }

        public async Task<IEnumerable<GalleryImage>> GetByCategoryWithCategoryAsync(int categoryId)
        {
            // Use .Include() and filter by CategoryId
            return await _dbSet
                .Include(gi => gi.Category) // Eagerly load the Category
                .Where(gi => gi.GalleryImageCategoryId == (int)(GalleryImageCategoryEnum)categoryId) // Filter directly in the query
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
