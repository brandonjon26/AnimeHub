using AnimeHub.Api.Entities;

namespace AnimeHub.Api.Repositories
{
    public interface IGalleryRepository : IBaseRepository<GalleryImage>
    {
        Task<IEnumerable<GalleryImage>> GetFeaturedWithCategoryAsync();
        Task<IEnumerable<GalleryImage>> GetByCategoryWithCategoryAsync(int categoryId);
    }
}
