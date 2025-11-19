using AnimeHub.Api.Data;
using AnimeHub.Api.Entities;
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
                .Where(gi => gi.GalleryImageCategoryId == categoryId) // Filter directly in the query
                .AsNoTracking()
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a GalleryImageCategory entity by ID.
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        public async Task<GalleryImageCategory?> GetCategoryByIdAsync(int categoryId)
        {
            // The category table is part of the context, but not a DbSet on this repository
            return await _context.Set<GalleryImageCategory>()
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.GalleryImageCategoryId == categoryId);
        }

        /// <summary>
        /// Checks if any image within a specific category is flagged as mature content.
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns></returns>
        public async Task<bool> HasMatureContentAsync(int categoryId)
        {
            return await _dbSet
                .Where(gi => gi.GalleryImageCategoryId == categoryId)
                .AnyAsync(gi => gi.IsMatureContent);
        }

        /// <summary>
        /// Adds a collection of images to the database context.
        /// </summary>
        /// <param name="images"></param>
        /// <returns></returns>
        public async Task AddRangeAsync(IEnumerable<GalleryImage> images)
        {
            // Calls the protected method in BaseRepository
            await _dbSet.AddRangeAsync(images);
        }

        /// <summary>
        /// Updates the IsMatureContent flag and resets the IsFeatured flag for all images
        /// in a category using EF Core's ExecuteUpdateAsync (Bulk Operation).
        /// </summary>
        /// <param name="categoryId"></param>
        /// <param name="isMatureContent"></param>
        /// <param name="featuredImageId"></param>
        /// <returns>The number of rows updated.</returns>
        public async Task<int> UpdateImagesByCategoryIdAsync(int categoryId, bool isMatureContent, long featuredImageId)
        {
            // 1. Bulk update all images in the category to the new IsMatureContent flag 
            //    and set IsFeatured to false (to un-feature the old image).
            int bulkUpdateCount = await _dbSet
                .Where(gi => gi.GalleryImageCategoryId == categoryId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(gi => gi.IsMatureContent, isMatureContent)
                    .SetProperty(gi => gi.IsFeatured, false)
                    .SetProperty(gi => gi.DateModified, DateTime.UtcNow)); // Set DateModified on all updated rows

            // 2. Find the specific featured image and set its IsFeatured flag to true.
            //    This is safer than a bulk update on the whole set, as we target one ID.
            int featuredUpdateCount = await _dbSet
                .Where(gi => gi.GalleryImageId == featuredImageId)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(gi => gi.IsFeatured, true)
                    .SetProperty(gi => gi.DateModified, DateTime.UtcNow));

            // The service layer will check bulkUpdateCount to confirm existence, 
            // but we return the count of the primary operation.
            return bulkUpdateCount;
        }

        /// <summary>
        /// Deletes all image records belonging to a specific category using 
        /// EF Core's ExecuteDeleteAsync (Bulk Operation).
        /// </summary>
        /// <param name="categoryId"></param>
        /// <returns>The number of rows deleted.</returns>
        public async Task<int> DeleteImagesByCategoryIdAsync(int categoryId)
        {
            // Use ExecuteDeleteAsync for efficient bulk delete without loading entities into memory.
            return await _dbSet
                .Where(gi => gi.GalleryImageCategoryId == categoryId)
                .ExecuteDeleteAsync();
        }
    }
}
