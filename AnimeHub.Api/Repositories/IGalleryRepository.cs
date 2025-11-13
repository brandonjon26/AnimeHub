using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Repositories
{
    public interface IGalleryRepository : IBaseRepository<GalleryImage>
    {
        Task<IEnumerable<GalleryImage>> GetFeaturedWithCategoryAsync();
        Task<IEnumerable<GalleryImage>> GetByCategoryWithCategoryAsync(int categoryId);
        Task<GalleryImageCategory?> GetCategoryByIdAsync(int categoryId);
        Task AddRangeAsync(IEnumerable<GalleryImage> images);
        Task<int> UpdateImagesByCategoryIdAsync(int categoryId, bool isMatureContent, long featuredImageId);
        Task<int> DeleteImagesByCategoryIdAsync(int categoryId);
    }
}
